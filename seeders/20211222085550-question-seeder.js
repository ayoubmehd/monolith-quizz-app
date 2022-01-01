'use strict';


const faker = require("faker");
const diffLevl = require("../repository/global")("DifficultyLevel");
const question = require("../repository/global")("Question");

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

    await queryInterface.bulkInsert("DifficultyLevels", [
      {
        label: "Easy",
        description: "Easy",
        numOfPointsMin: 5,
        numOfPointsMax: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        label: "Medium",
        description: "Medium",
        numOfPointsMin: 11,
        numOfPointsMax: 15,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        label: "Hard",
        description: "Hard",
        numOfPointsMin: 16,
        numOfPointsMax: 20,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);

    const elCount = 20;
    const [diffLevel, diffLevelRes] = await diffLevl.findAll();

    const qArray = [];
    for (let i = 0; i < elCount; i++) {
      qArray.push({
        question: faker.lorem.words(5),
        DifficultyLevelId: faker.random.arrayElement(diffLevelRes).id,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }

    await queryInterface.bulkInsert('Questions', qArray);

    const aArray = [];
    const [questionErr, questionRes] = await question.findAll();
    for (let i = 0; i < elCount; i++) {
      aArray.push({
        isCorrect: faker.random.arrayElement([true, false]),
        QuestionId: faker.random.arrayElement(questionRes).id,
        text: faker.lorem.words(3),
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }
    await queryInterface.bulkInsert('Answers', aArray);


  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('DifficultyLevels', null, {});
    await queryInterface.bulkDelete('Questions', null, {});
  }
};
