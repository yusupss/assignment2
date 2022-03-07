'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const dateNow = new Date();
    const nextweek = new Date(
      dateNow.getFullYear(),
      dateNow.getMonth(),
      dateNow.getDate() + 7,
    );
    await queryInterface.bulkInsert('Todos', [
      {
        title: 'Todos dummy 1',
        description: 'Todos dummy 1 blablablablablababla',
        UserId: 1,
        due_date: nextweek,
        createdAt: dateNow,
        updatedAt: dateNow
      },
      {
        title: 'Todos dummy 2',
        description: 'Todos dummy 2 blablablablablababla',
        UserId: 2,
        due_date: nextweek,
        createdAt: dateNow,
        updatedAt: dateNow
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Todos', null, {});
  }
};