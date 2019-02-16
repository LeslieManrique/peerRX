'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    // seeding the SpecialtyItems table with types of specialties
    return queryInterface.bulkInsert('SpecialtyItems', [
      {
        id: 1,
        description: "Specialty 1",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        description: "Specialty 2",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        description: "Specialty 3",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('SpecialtyItems', null, {});
  }
};