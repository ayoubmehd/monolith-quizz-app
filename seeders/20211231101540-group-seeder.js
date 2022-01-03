'use strict';
const faker = require("faker");
const repo = require("../repository/global");
const bcrypt = require("bcrypt");

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

    const insertGroups = [];
    for (let i = 0; i < elCount; i++) {
      insertGroups.push({
        text: faker.lorem.words(6),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert('Groups', insertGroups);
    const role = repo("Role");
    const group = repo("Group");

    const [err, studentRole] = await role.findAll({
      where: {
        type: "student"
      }
    });

    const [errGroup, groups] = await group.findAll();

    const users = [];
    for (let i = 0; i < elCount; i++) {
      users.push({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: await bcrypt.genSalt(10).then(salt => bcrypt.hash("123456789", salt)),
        RoleId: studentRole[0].id,
        GroupId: faker.random.arrayElement(groups).id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert('Users', users);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Groups', null, {});
  }
};
