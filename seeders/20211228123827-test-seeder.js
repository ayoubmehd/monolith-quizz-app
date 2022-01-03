'use strict';

const faker = require("faker");

const subject = require("../repository/global")("Subject");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */


    const elCount = 20;

    const [errSubject, subjects] = await subject.findAll();
    const data = [];
    for (let i = 0; i < elCount; i++) {
      data.push({
        label: faker.lorem.word(10),
        displayCorrectAnswer: faker.random.arrayElement([true, false]),
        passingScore: faker.datatype.number(80),
        SubjectId: subjects.length > 1 ? faker.random.arrayElement(subjects).id : null,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    await queryInterface.bulkInsert("Tests", data);

  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('Tests', null, {});
  }
};
