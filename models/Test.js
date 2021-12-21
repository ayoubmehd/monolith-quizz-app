'use strict';
const {
    Model, DATE
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Test extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Test.belongsTo(models.Subject);
            Test.hasMany(models.StudentAnswerTestQuestion);
            Test.belongsToMany(models.Student, {
                through: models.StudentPassTest
            });
        }
    };
    Test.init({
        displayCorrectAnswer: DataTypes.BOOLEAN,
        passingScore: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Test',
    });
    return Test;
};