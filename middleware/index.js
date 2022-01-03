const fs = require("fs");
const path = require("path");

const middlewares = {};

fs.readdirSync(__dirname)
    .filter(file => file !== path.basename(__filename))
    .forEach(file => {
        const middleware = file.split(".")[0];

        middlewares[middleware] = require(`./${file}`);

    });

module.exports = middlewares;