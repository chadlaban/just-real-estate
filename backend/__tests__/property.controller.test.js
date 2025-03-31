import { jest } from "@jest/globals";

jest.mock("../models/property.model.js"); // resolves 'Property.findAndCountAll is not a Jest mock function' error

import {
  getProperties,
  addProperty,
  updateProperty,
  deleteProperty,
} from "../controllers/property.controller.js";
import Property from "../models/property.model.js";

describe("Property Controller - CRUD", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        formatted_address: "123 Test St",
        address_line1: "Test Address",
        city: "Testville",
      },
      params: { id: 1 },
    };

    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  describe("retrieving property records", () => {
    let req, res;

    beforeEach(() => {
      req = {
        query: {
          page: 1,
          limit: 10,
          search: "",
          sort_by: "createdAt",
          order: "ASC",
        },
      };
      res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
    });

    it("return paginated properties", async () => {
      Property.findAndCountAll = jest.fn().mockResolvedValue({
        rows: [{ id: 1, formatted_address: "123 Test St", city: "Testville" }],
        count: 1,
      });

      await getProperties(req, res);

      expect(Property.findAndCountAll).toHaveBeenCalledWith({
        where: { deleted_at: null },
        limit: 10,
        offset: 0,
        order: [["createdAt", "ASC"]],
      });

      expect(res.json).toHaveBeenCalledWith({
        data: [{ id: 1, formatted_address: "123 Test St", city: "Testville" }],
        totalPages: 1,
        currentPage: 1,
        totalCount: 1,
      });
    });

    it("return an error if an exception occurs", async () => {
      Property.findAndCountAll = jest
        .fn()
        .mockRejectedValue(new Error("Database error"));

      await getProperties(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });
  });

  describe("adding property record", () => {
    it("return error if validation fails", async () => {
      req.body = {};

      await addProperty(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false })
      );
    });
  });

  describe("update property record", () => {
    it("update the property successfully", async () => {
      Property.findByPk = jest.fn().mockResolvedValue({
        update: jest.fn().mockResolvedValue(true),
      });

      await updateProperty(req, res);

      expect(Property.findByPk).toHaveBeenCalledWith(req.params.id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Property updated successfully",
        property: expect.any(Object),
      });
    });

    it("return 404 if property is not found", async () => {
      Property.findByPk = jest.fn().mockResolvedValue(null);

      await updateProperty(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Property not found",
      });
    });
  });

  describe("deleting property record", () => {
    it("delete the property successfully", async () => {
      Property.findByPk = jest.fn().mockResolvedValue({
        update: jest.fn().mockResolvedValue(true),
      });

      await deleteProperty(req, res);

      expect(Property.findByPk).toHaveBeenCalledWith(req.params.id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
      });
    });

    it("return 404 if property is not found", async () => {
      Property.findByPk = jest.fn().mockResolvedValue(null);

      await deleteProperty(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Property not found",
      });
    });
  });
});
