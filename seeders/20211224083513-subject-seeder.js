'use strict';


const faker = require("faker");

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


    // Generate Parent Subjects
    const elCount = 5;

    const psArr = [];
    for (let i = 0; i < elCount; i++) {
      psArr.push({
        name: faker.lorem.word(),
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }

    await queryInterface.bulkInsert('Subjects', psArr);


    // Generate parent Subjects




    const pcArr = [];
    for (let i = 0; i < elCount; i++) {
      const [err, data] = await require("../repository/global")("Subject").findAll();
      pcArr.push({
        name: faker.lorem.word(),
        SubjectId: faker.random.arrayElement(data).id,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }

    await queryInterface.bulkInsert('Subjects', pcArr);


  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
