'use strict';

const { hash } = require("../helpers/hash-helper");

module.exports = {
  async up(queryInterface, Sequelize) {
    const dateNow = new Date();
    await queryInterface.bulkInsert('Users', [
      {
        username: 'yusup1',
        email: 'yusup+1@softwareseni.com',
        password: hash('password'),
        createdAt: dateNow,
        updatedAt: dateNow
      },
      {
        username: 'adi-tiatama',
        email: 'adi.t@softwareseni.com',
        password: hash('password'),
        createdAt: dateNow,
        updatedAt: dateNow
      },
      {
        username: 'alun',
        email: 'alun@softwareseni.com',
        password: hash('password'),
        createdAt: dateNow,
        updatedAt: dateNow
      },
      {
        username: 'nico',
        email: 'nico@softwareseni.com',
        password: hash('password'),
        createdAt: dateNow,
        updatedAt: dateNow
      },
      {
        username: 'fandy',
        email: 'fandy@softwareseni.com',
        password: hash('password'),
        createdAt: dateNow,
        updatedAt: dateNow
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};