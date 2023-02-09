import Sequelize from "sequelize";

const sequelize = new Sequelize(
  process.env.DB,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: "localhost",
    dialect: "postgres",
    operatorsAliases: false,
  }
);

const models = {
  User: sequelize.import("./user.js"),
  Profile: sequelize.import("./profile.js"),
};

Object.keys(models).forEach((key) => {
  if ("associate" in models[key]) {
    models[key].associate(models);
  }
});

sequelize
  .authenticate()
  .then(() => {
    console.log("conmection has been established successfuly");
  })
  .catch((err) => {
    console.error("unable to connect to the database", err);
  });

export { sequelize };
export default models;
