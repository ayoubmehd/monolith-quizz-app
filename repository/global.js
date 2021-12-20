
const db = require("../models");

function error(code) {

    const errorCodes = {
        404: "Not Found",
        500: "Server Error"
    }

    return {
        code,
        message: errorCodes[code]
    };

}


module.exports = (model) => {

    if (!(model in db.sequelize.models)) {
        throw new Error("This model dosn't exist, maybe you misspell it");
    }

    /**
     * @returns {Array}
     */
    async function findAll(clauses = {}) {
        try {

            const data = await db.sequelize.models[model].findAll(clauses);

            return [null, data];

        } catch (err) {
            console.log(err);
            return [error(500), null];
        }
    }

    /**
     * 
     * @param {Number} id
     * @returns {Object} 
     */
    async function findOne(id) {
        try {

            const data = await db.sequelize.models[model].findByPk(id);

            if (!data) {
                return [null, data];
            }

        } catch (err) {

            console.log(err);
            return [error(500), null];

        }
    }

    /**
     * 
     * @param {Object} payload 
     * @returns {Object} 
     */
    async function create(payload) {
        try {

            const data = await db.sequelize.models[model].create(payload);

            return [null, data];

        } catch (err) {

            console.log(err);
            return [error(500), null];

        }
    }

    /**
     *
     * @param {Number} id
     * @param {Object} payload
     * @returns {Object}
     */
    async function update(id, payload) {

        try {

            const data = await db.sequelize.models[model].findByPk(id);

            if (!data) {
                return [error(404), null];
            }

            data.update(payload);

            return [null, data];

        } catch (err) {

            console.log(err);
            return [error(500), null];

        }
    }

    /**
     *
     * @param {Number} id
     * @returns {Object}
     */
    async function destroy(id) {
        try {

            const data = await db.sequelize.models[model].findByPk(id);

            if (!data) {
                return [error(404), null];
            }

            data.destroy();

            return [null, data];

        } catch (err) {
            console.log(err);
            return [error(500), null];
        }
    }


    return {
        findAll,
        findOne,
        create,
        update,
        destroy
    };
}