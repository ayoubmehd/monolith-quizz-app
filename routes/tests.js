const path = require("path");
const sqrl = require("squirrelly");
const express = require('express');
const router = express.Router();
const repo = require("../repository/global");
const db = require("../models");
const test = repo("Test");
const subject = repo("Subject");
const student = repo("User");
const group = repo("Group");

const { former } = require("../middleware");

const defTemplate = require("../helpers/defTemplate");


router.use(former);

/**
 * Pages: GET Request only
 */

/* GET home page. */
router.get('/', async (req, res, next) => {

    const [testErr, tests] = await test.findAll();

    const compiled = await sqrl.renderFile(path.join(__dirname, "../views/tests/table/tbody.squirrelly"), { data: tests })
        .then(compiled => sqrl.compile(compiled));

    sqrl.templates.define("tbody", compiled);

    res.render('tests/index');
});

router.get("/new", async (req, res) => {

    if (!req.query.subject) {

        const [err, data] = await subject.findAll({ where: { SubjectId: null } });

        res.render("ui/subjects", {
            data
        });

        return res.end();
    }


    const [subErr, subjectData] = await subject.findOne(req.query.subject);

    res.render('tests/create', {
        subject: subjectData
    });

});


router.get('/:id/edit', async (req, res, next) => {

    if (!req.query.subject) {

        const [err, data] = await subject.findAll({ where: { SubjectId: null } });

        res.render("ui/subjects", {
            data
        });

        return res.end();
    }


    const [err, data] = await test.findOne(req.params.id);
    const [subErr, subjectData] = await subject.findOne(req.query.subject);

    res.render('tests/edit', {
        data,
        subject: subjectData
    });

});


router.get('/:id/assign', async (req, res, next) => {

    const [errTest, testData] = await test.findOne(req.params.id);
    // Assing Test To Students
    if (!req.query.assignTo || req.query.assignTo === 'students') {

        const [errStudent, students] = await student.findAll({
            include: {
                model: db.sequelize.models.Role,
                where: {
                    type: 'student'
                }
            }
        });

        await defTemplate("tbody", "/students/ui/tbody", { data: students, test: testData });

        res.render("tests/assign-students");
        return res.end();

    }

    const [errGroup, groups] = await group.findAll();

    await defTemplate("tbody", "/groups/ui/tbody", { data: groups, test: testData });

    res.render("tests/assign-groups");
    res.end();

});


/**
 * Actions: None Get Request POST | DELETE | PATCH | PUT
 */

router.post("/", async (req, res) => {

    const [err, data] = await test.create({
        label: req.body.label,
        displayCorrectAnswer: Boolean(req.body.display_correct_answer),
        passingScore: req.body.passing_score,
        description: req.body.description,
        SubjectId: req.body.subject_id,
    });

    res.redirect("/tests");

});

router.post('/:id/delete', async (req, res, next) => {
    const [error, data] = await test.destroy(req.params.id);

    if (error) {
        res.status(error.code);
        res.send(error.message);
    }

    res.redirect("/tests");

});

router.post('/:id/edit', async (req, res, next) => {

    const [error, data] = await test.update(req.params.id, {
        label: req.body.label,
        displayCorrectAnswer: Boolean(req.body.display_correct_answer),
        passingScore: req.body.passing_score,
        description: req.body.description,
        SubjectId: req.body.subject_id,
    });

    if (error) {
        res.status(error.code);
        res.send(error.message);
    }

    res.redirect("/tests");

});


/**
 * Assign test to student | group
 */

// Student
router.post("/:test/assign/:student/student", async (req, res) => {

    const [testErr, testData] = await test.findOne(req.params.test);
    const [stuErr, studentData] = await student.findOne(req.params.student);

    if (testErr || stuErr) {

        res.status(testErr.code === stuErr.code ? testErr.code : testErr.code);

        console.log("TestError: " + testErr.message);
        console.log("StudentError: " + stuErr.message);

        return res.end();
    }

    const studentPassTest = repo("StudentPassTest");

    const [err, data] = await studentPassTest.create({
        attempt: 0,
        startDate: new Date(),
        TestId: req.params.test,
        UserId: req.params.student
    });


    if (err) {

        res.status(err.code);

        console.log("StudentPassTestError: " + testErr.message);

        return res.end();
    }

    res.redirect("/tests");

});

// Group
router.post("/:test/assign/:group/group", async (req, res) => {

    const [testErr, testData] = await test.findOne(req.params.test);
    const [groupErr, groupData] = await group.findOne(req.params.group);

    if (testErr || groupErr) {

        res.status(testErr.code === groupErr.code ? testErr.code : testErr.code);

        console.log("TestError: " + testErr.message);
        console.log("GroupError: " + groupErr.message);

        return res.end();
    }

    const studentPassTest = repo("TestAssignGroup");

    const [err, data] = await studentPassTest.create({
        TestId: req.params.test,
        GroupId: req.params.group,
    });


    if (err) {

        res.status(err.code);

        console.log("TestAssignGroupError: " + err.message);

        return res.end();
    }

    res.redirect("/tests");

});

module.exports = router;
