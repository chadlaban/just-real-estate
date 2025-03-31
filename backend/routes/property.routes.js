import express from "express";
import {
  getProperties,
  addProperty,
  updateProperty,
  deleteProperty,
} from "../controllers/property.controller.js";

const router = express.Router();

router.get("/properties", getProperties);
router.post("/properties/create", addProperty);
router.put("/properties/update/:id", updateProperty);
router.delete("/properties/delete/:id", deleteProperty);

export default router;
