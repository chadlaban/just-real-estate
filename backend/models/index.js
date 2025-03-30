import sequelize from "../config/database.js";
import Property from "./property.model.js";

sequelize
  .sync({ alter: true })
  .then(() => console.log("Database synced"))
  .catch((e) => console.error("Sync error:", e));

export { Property };
