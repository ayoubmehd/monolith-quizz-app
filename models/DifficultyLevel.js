'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class DifficultyLevel extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    DifficultyLevel.init({
        label: DataTypes.STRING,
        description: DataTypes.STRING,
        numOfPointsMin: DataTypes.INTEGER.UNSIGNED,
        numOfPointsMax: DataTypes.INTEGER.UNSIGNED
    }, {
        sequelize,
        modelName: 'DifficultyLevel',
    });
    return DifficultyLevel;
};