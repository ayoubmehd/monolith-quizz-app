'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Student extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Student.belongsTo(models.User);
            Student.belongsTo(models.Group);

            Student.hasMany(models.StudentAnswerTestQuestion);

            Student.belongsToMany(models.Test, {
                through: models.StudentPassTest
            });

        }
    };
    Student.init({
    }, {
        sequelize,
        modelName: 'Student',
    });
    return Student;
};