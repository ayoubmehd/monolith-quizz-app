const defTemplate = require("../defTemplate");
const Sqrl = require("squirrelly");
const path = require("path");

module.exports = async (req, res, next) => {
    try {

        const temp = await Sqrl.loadFile(path.join(__dirname, `../../views/layout/main.squirrelly`));

        Sqrl.templates.define("main", temp);
    } catch (error) {
        console.log(error);
    }

    next();
}