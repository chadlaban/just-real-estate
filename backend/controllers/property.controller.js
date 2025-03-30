import fetch from "node-fetch";
import sequelize from "../config/database.js";
import { Op } from "sequelize";
import "dotenv/config";
import { Property } from "../models/index.js";

const API_URL = "https://api.rentcast.io/v1/properties/random?limit=300";
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

    res.status(200).json({ message: "Properties imported successfully!" });
  } catch (error) {
    console.error("Error importing properties:", error);
    res.status(500).json({ error: "Failed to import properties" });
  }
};

const getProperties = async (req, res) => {
  try {
    const { page, limit, search = "" } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = search
      ? {
          [Op.or]: [
            { formatted_address: { [Op.iLike]: `%${search}%` } },
            { address_line1: { [Op.iLike]: `%${search}%` } },
            { address_line2: { [Op.iLike]: `%${search}%` } },
            { property_type: { [Op.iLike]: `%${search}%` } },
            { city: { [Op.iLike]: `%${search}%` } },
            { legal_description: { [Op.iLike]: `%${search}%` } },
            { subdivision: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};

    const { rows: properties, count: totalCount } =
      await Property.findAndCountAll({
        where: whereClause,
        limit: Number(limit),
        offset: Number(offset),
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

export { importProperties, getProperties };
