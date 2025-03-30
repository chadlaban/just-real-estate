import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Property = sequelize.define("Property", {
  formatted_address: DataTypes.STRING,
  address_line1: DataTypes.STRING,
  address_line2: DataTypes.STRING,
  city: DataTypes.STRING,
  state: DataTypes.STRING,
  zip_code: DataTypes.STRING,
  county: DataTypes.STRING,
  latitude: DataTypes.FLOAT,
  longitude: DataTypes.FLOAT,
  property_type: DataTypes.STRING,
  bedrooms: DataTypes.INTEGER,
  bathrooms: DataTypes.FLOAT,
  square_footage: DataTypes.INTEGER,
  lot_size: DataTypes.INTEGER,
  year_built: DataTypes.INTEGER,
  assessor_id: DataTypes.STRING,
  legal_description: DataTypes.STRING,
  subdivision: DataTypes.STRING,
  last_sale_date: DataTypes.DATE,
});

export default Property;
