const path = require("path");
const sqrl = require("squirrelly");
var express = require('express');
const db = require("../models/index");
var router = express.Router();
const repo = require("../repository/global");
const question = repo("Question");

const { former } = require("../middleware");

const diffLevel = repo("DifficultyLevel");

router.use(former);

/* GET home page. */
router.get('/', async (req, res, next) => {

    const [questionErr, questionRes] = await question.findAll({
        include: 'Answers'
    });

    try {
        sqrl.filters.define("find", (arr) => {
            if (arr.length < 1) return 'No answers';

            const correctAnswer = arr.find(item => item.isCorrect);

            if (!correctAnswer) return 'No correct answer';


            return correctAnswer.text
        });
        const compiled = await sqrl.renderFile(path.join(__dirname, "../views/questions/table/tbody.squirrelly"), { data: questionRes })
            .then(compiled => sqrl.compile(compiled));

        sqrl.templates.define("tbody", compiled);

        res.render('questions/index', {});
    } catch (err) {
        console.log(err);
    }

});


// Craete New Question
router.get('/new', async (req, res, next) => {

    const subject = repo("Subject");

    if (!req.query.subject) {

        const [err, data] = await subject.findAll({ where: { SubjectId: null } });

        res.render("questions/subjects", {
            data
        });

        console.log("What?", data);

        return res.end();
    }

    const [err, data] = await subject.findOne(req.query.subject);
    const [errDiffLevel, diffLevels] = await diffLevel.findAll();

    // console.log(diffLevels);

    res.render("questions/create", {
        subject: data,
        diffLevels
    });

});

// Craete New Question
router.post('/', async (req, res, next) => {

    const t = await db.sequelize.transaction();

    try {

        const [err, data] = await question.create({
            question: req.body.text,
            Answers: req.body.answers.map(
                (val, index) => ({
                    text: val,
                    isCorrect: req.body.is_correct[index]
                })
            ),
            SubjectId: req.body.subject_id,
            DifficultyLevelId: req.body.diff_level,
        }, {
            include: [db.sequelize.models.Answer]
        });

        await t.commit();


    } catch (error) {
        console.log(error);
        await t.rollback();
    }

    res.redirect("/questions");

});


router.post('/:id/delete', async (req, res, next) => {
    const [error, data] = await question.destroy(req.params.id);

    if (error) {
        res.status(error.code);
        res.send(error.message);
    }

    res.redirect("/questions");

});

router.get("/:id/edit", async (req, res, next) => {


    const subject = repo("Subject");
    if (!req.query.subject) {

        const [err, data] = await subject.findAll({ where: { SubjectId: null } });

        res.render("questions/subjects", {
            data
        });

        return res.end();
    }

    const [sErr, currentSubject] = await subject.findOne(req.query.subject);

    const [qErr, data] = await question.findOne(req.params.id, {
        include: ['Answers', 'Subject']
    });

    // if (err) {
    //     res.status(err.code);
    //     return res.send(err.message);
    // }

    const [errDiffLevel, diffLevels] = await diffLevel.findAll();

    res.render("questions/edit", {
        data,
        subject: currentSubject,
        diffLevels
    });
});

// Edit Question
router.post('/:id/edit', async (req, res, next) => {


    const t = await db.sequelize.transaction();

    try {

        const [err, data] = await question.update(req.params.id, {
            question: req.body.text,
            Answers: req.body.answers ? req.body.answers.map(
                (val, index) => ({
                    text: val,
                    isCorrect: req.body.is_correct[index]
                })
            ) : [],
            SubjectId: req.body.subject_id,
            DifficultyLevelId: req.body.diff_level,
        }, {
            include: [db.sequelize.models.Answer]
        });

        await t.commit();


    } catch (error) {
        console.log(error);
        await t.rollback();
    }

    res.redirect("/questions");

});

module.exports = router;
