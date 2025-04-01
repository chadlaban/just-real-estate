import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./user.model.js";

const Properties = sequelize.define("Properties", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  },
  formatted_address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address_line1: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address_line2: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  zip_code: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  county: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  property_type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bedrooms: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  bathrooms: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  square_footage: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  lot_size: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  year_built: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  assessor_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  legal_description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  subdivision: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  last_sale_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  created_by: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  deleted_by: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

Properties.belongsTo(User, { foreignKey: "userId" });

export default Properties;
