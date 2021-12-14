const { sequelize } = require("../models");
const repository = require("../repository/global");

// Create a new model
test("test the create action for User", async () => {

    await sequelize.authenticate();
    await sequelize.sync({ force: true });

    const user = repository("User");
    const payload = {
        firstName: "Ayoub",
        lastName: "El",
        email: "s@gmail.com",
        password: "123456789",
    };

    const [error, data] = await user.create(payload);

    expect(data).not.toBe(null);
    expect(error).toBeNull();
});

// Create a new model
test("test the getAll action for User", async () => {

    await sequelize.authenticate();
    await sequelize.sync({ force: true });

    const user = repository("User");

    const [error, data] = await user.findAll();

    expect(data).toEqual([]);
    expect(error).toBeNull();
});
