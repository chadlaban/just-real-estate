import express from "express";
import {
  getProperties,
  getPropertyDetails,
  addProperty,
  updateProperty,
  deleteProperty,
} from "../controllers/property.controller.js";

const router = express.Router();

router.get("/properties", getProperties);
router.get("/properties/details/:id", getPropertyDetails);
router.post("/properties/create", addProperty);
router.put("/properties/update/:id", updateProperty);
router.delete("/properties/delete/:id", deleteProperty);

export default router;
