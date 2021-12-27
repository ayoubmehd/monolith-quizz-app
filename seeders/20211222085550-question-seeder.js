'use strict';


const faker = require("faker");
const answer = require("../repository/global")("Answer");
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

    const elCount = 20;

    const qArray = [];
    for (let i = 0; i < elCount; i++) {
      qArray.push({
        question: faker.lorem.words(5),
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }
    const aArray = [];
    for (let i = 0; i < elCount; i++) {
      aArray.push({
        text: faker.lorem.words(3),
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }
    const aqArray = [];
    const [asnwerErr, answerRes] = await answer.findAll();
    const [questionErr, questionRes] = await question.findAll();
    for (let i = 0; i < elCount; i++) {
      aqArray.push({
        isCorrect: faker.random.arrayElement([true, false]),
        AnswerId: faker.random.arrayElement(answerRes).id,
        QuestionId: faker.random.arrayElement(questionRes).id,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }

    await queryInterface.bulkInsert('Answers', aArray);
    await queryInterface.bulkInsert('Questions', qArray);
    await queryInterface.bulkInsert('AnswerQuestions', aqArray);

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
