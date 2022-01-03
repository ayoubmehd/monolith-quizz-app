'use strict';

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
    // return queryInterface.bulkInsert('Roles', [{
    //   type: 'admin',
    //   createdAt: new Date(),
    //   updatedAt: new Date()
    // },
    // {
    //   type: 'student',
    //   createdAt: new Date(),
    //   updatedAt: new Date()
    // }, {
    //   type: 'former',
    //   createdAt: new Date(),
    //   updatedAt: new Date()
    // }]);

  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('Roles', null, {});
  }
};
