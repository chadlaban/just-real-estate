const path = require("path");
const fs = require("fs");
const csvParser = require("csv-parser");

const normalizeNull = (value) => {
  if (
    value === "NULL" ||
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }
  return value;
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const csvFilePath = path.join(__dirname, "Properties.csv");
    const properties = [];

    await new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csvParser())
        .on("data", (row) => {
          properties.push({
            formatted_address: normalizeNull(row.formatted_address),
            address_line1: normalizeNull(row.address_line1),
            address_line2: normalizeNull(row.address_line2),
            city: normalizeNull(row.city),
            state: normalizeNull(row.state),
            zip_code: normalizeNull(row.zip_code),
            county: normalizeNull(row.county),
            latitude: isNaN(parseFloat(row.latitude))
              ? null
              : parseFloat(row.latitude),
            longitude: isNaN(parseFloat(row.longitude))
              ? null
              : parseFloat(row.longitude),
            property_type: normalizeNull(row.property_type),
            bedrooms:
              row.bedrooms === "NULL" || isNaN(parseInt(row.bedrooms, 10))
                ? null
                : parseInt(row.bedrooms, 10),
            bathrooms:
              row.bathrooms === "NULL" || isNaN(parseInt(row.bathrooms, 10))
                ? null
                : parseInt(row.bathrooms, 10),
            square_footage:
              row.square_footage === "NULL" ||
              isNaN(parseFloat(row.square_footage))
                ? null
                : parseFloat(row.square_footage),
            lot_size:
              row.lot_size === "NULL" || isNaN(parseFloat(row.lot_size))
                ? null
                : parseFloat(row.lot_size),
            year_built:
              row.year_built === "NULL" || isNaN(parseInt(row.year_built, 10))
                ? null
                : parseInt(row.year_built, 10),
            assessor_id: normalizeNull(row.assessor_id),
            legal_description: normalizeNull(row.legal_description),
            subdivision: normalizeNull(row.subdivision),
            last_sale_date:
              normalizeNull(row.last_sale_date) &&
              !isNaN(Date.parse(row.last_sale_date))
                ? new Date(row.last_sale_date)
                : null,
            created_by: normalizeNull(row.created_by),
            deleted_at:
              normalizeNull(row.deleted_at) &&
              !isNaN(Date.parse(row.deleted_at))
                ? new Date(row.deleted_at)
                : null,
            deleted_by: normalizeNull(row.deleted_by),
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: 1,
          });
        })
        .on("end", resolve)
        .on("error", reject);
    });

    await queryInterface.bulkInsert("Properties", properties, {});
    console.log("CSV Data Imported to Properties table");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Properties", null, {});
  },
};
