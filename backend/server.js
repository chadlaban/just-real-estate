import "dotenv/config";
import "./config/database.js";
import express from "express";
import cors from "cors";
import propertyRoutes from "./routes/property.routes.js";
// import cron from "node-cron";
// import importProperties from "./controllers/property.controller.js";

const app = express();

app.use(
  cors({
    origin: process.env.URL + process.env.CLIENT_PORT,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.use("/api", propertyRoutes);

// fetch and import data
// cron.schedule("* * * * *", async () => {
//   try {
//     console.log("Running importProperties job...");
//     await importProperties();
//   } catch (error) {
//     console.error("Error in importProperties job:", error);
//   }
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
