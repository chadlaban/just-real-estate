import express from "express";
import { getProperties } from "../controllers/property.controller.js";

const router = express.Router();

router.get("/properties", getProperties);

export default router;
