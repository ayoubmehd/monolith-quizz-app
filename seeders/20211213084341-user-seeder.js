'use strict';

const faker = require("faker");
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

    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Roles', null, {});

    await queryInterface.bulkInsert('Roles', [{
      type: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      type: 'student',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      type: 'former',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    const role = require("../repository/global")("Role");
    9
    const [err, roles] = await role.findAll();

    const elCount = 20;

    const users = [];
    for (let i = 0; i < elCount; i++) {
      users.push({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: await bcrypt.genSalt(10).then(salt => bcrypt.hash("123456789", salt)),
        RoleId: faker.random.arrayElement(roles).id,
        createdAt: new Date(),
        updatedAt: new Date()
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
    await queryInterface.bulkDelete('Users', null, {});
  }
};
