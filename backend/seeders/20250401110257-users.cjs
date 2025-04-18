const users = [
  {
    id: 1,
    username: "chad",
    email: "chad@justrealestate.com",
    password: "hashed_password_1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    username: "user",
    email: "user@justrealestate.com",
    password: "hashed_password_2",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Users", users, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
