import fetch from "node-fetch";
import sequelize from "../config/database.js";
import { Op } from "sequelize";
import "dotenv/config";
import { z } from "zod";
import { Property } from "../models/index.js";
import { propertySchema } from "../schemas/property.js";

const API_URL = "https://api.rentcast.io/v1/properties/random?limit=600";
const API_KEY = process.env.API_KEY;

const importProperties = async (req, res) => {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: { accept: "application/json", "X-Api-Key": API_KEY },
    });

    const properties = await response.json();

    if (!Array.isArray(properties)) {
      console.error("Error: API response is not an array", properties);
      return res.status(500).json({ error: "Invalid API response format" });
    }

    for (let data of properties) {
      const transaction = await sequelize.transaction();
      try {
        await Property.create(
          {
            formatted_address: data.formattedAddress,
            address_line1: data.addressLine1,
            city: data.city,
            state: data.state,
            zip_code: data.zipCode,
            latitude: data.latitude,
            longitude: data.longitude,
            property_type: data.propertyType,
            bedrooms: data.bedrooms,
            bathrooms: data.bathrooms,
            square_footage: data.squareFootage,
            lot_size: data.lotSize,
            year_built: data.yearBuilt,
            assessor_id: data.assessorID,
            legal_description: data.legalDescription,
            subdivision: data.subdivision,
            last_sale_date: data.lastSaleDate,
            created_by: "API",
          },
          { transaction }
        );

        // console.log("Created Property ID:", property.id);

        await transaction.commit();
      } catch (error) {
        console.error("Error importing property:", error);
        await transaction.rollback();
      }
    }

    return res
      .status(200)
      .json({ message: "Properties imported successfully!" });
  } catch (error) {
    console.error("Error importing properties:", error);
    res.status(500).json({ error: "Failed to import properties" });
  }
};

const getProperties = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      sort_by,
      order = "DESC",
    } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {
      deleted_at: null,
      // for better data representation on frontend
      property_type: { [Op.ne]: null },
      bedrooms: { [Op.ne]: null },
      bathrooms: { [Op.ne]: null },
      square_footage: { [Op.ne]: null },
      lot_size: { [Op.ne]: null },
      ...(search && {
        [Op.or]: [
          { formatted_address: { [Op.iLike]: `%${search}%` } },
          { address_line1: { [Op.iLike]: `%${search}%` } },
          { address_line2: { [Op.iLike]: `%${search}%` } },
          { property_type: { [Op.iLike]: `%${search}%` } },
          { city: { [Op.iLike]: `%${search}%` } },
          { legal_description: { [Op.iLike]: `%${search}%` } },
          { subdivision: { [Op.iLike]: `%${search}%` } },
        ],
      }),
    };

    const orderClause = [];
    if (sort_by) {
      orderClause.push([sort_by, order]);
    }

    const { rows: properties, count: totalCount } =
      await Property.findAndCountAll({
        where: whereClause,
        limit: Number(limit),
        offset: Number(offset),
        order: orderClause.length ? orderClause : [["createdAt", "ASC"]],
      });

    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      data: properties,
      totalPages,
      currentPage: Number(page),
      totalCount,
    });
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getPropertyDetails = async (req, res) => {
  try {
    // console.log(req.params.id);
    const property = await Property.findByPk(req.params.id);
    // console.log(property);
    if (!property)
      return res.status(404).json({ message: "Property not found" });

    // similar properties by number of bedrooms
    const similarProperties = await Property.findAll({
      where: {
        bedrooms: property.bedrooms,
        id: { [Op.ne]: property.id },
      },
      limit: 8,
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      property,
      similarProperties,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// create
const addProperty = async (req, res) => {
  try {
    const form = propertySchema.parse(req.body);

    // console.log(form);

    await Property.create(form);

    return res.status(201).json({
      success: true,
      message: "Property added successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError)
      return res.status(400).json({ success: false, errors: error.errors });

    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// update
const updateProperty = async (req, res) => {
  try {
    // console.log("request body:", req.body);

    const { id } = req.params;
    const form = propertySchema.partial().parse(req.body); // updates specific fields

    const property = await Property.findByPk(id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    await property.update(form);

    return res.status(200).json({
      success: true,
      message: "Property updated successfully",
      property,
    });
  } catch (error) {
    if (error instanceof z.ZodError)
      return res.status(400).json({ success: false, errors: error.errors });

    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// delete
const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findByPk(id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    // soft delete
    await property.update({ deleted_at: new Date() });

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export {
  importProperties,
  getProperties,
  getPropertyDetails,
  addProperty,
  updateProperty,
  deleteProperty,
};
