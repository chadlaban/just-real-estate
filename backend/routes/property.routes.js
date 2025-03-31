import express from "express";
import {
  getProperties,
  addProperty,
} from "../controllers/property.controller.js";

const router = express.Router();

router.get("/properties", getProperties);
router.post("/properties/create", addProperty);

export default router;
