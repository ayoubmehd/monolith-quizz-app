const path = require("path");
const sqrl = require("squirrelly");

module.exports = async (templateName, fileDir, data = {}) => {
    const compiled = await sqrl.renderFile(path.join(__dirname, `../views/${fileDir}.squirrelly`), data)
        .then(compiled => sqrl.compile(compiled));

    sqrl.templates.define(templateName, compiled);
}