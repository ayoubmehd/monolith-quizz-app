'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Former extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Former.belongsTo(models.User)
        }
    };
    Former.init({
        speciality: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Former',
    });
    return Former;
};