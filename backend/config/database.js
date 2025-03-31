import { Sequelize } from "sequelize";
import "dotenv/config";

const NODE_ENV = process.env.NODE_ENV || "development";

const DB_NAME =
  NODE_ENV === "test" ? process.env.TEST_DB_NAME : process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_PORT =
  NODE_ENV === "test" ? process.env.DB_TEST_PORT : process.env.DB_PORT;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "postgres",
  logging: false,
});

sequelize
  .authenticate()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((error) => console.error("Database connection error:", error));

export default sequelize;
