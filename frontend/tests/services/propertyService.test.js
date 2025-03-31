import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {
  fetchProperties,
  addProperty,
  updateProperty,
  deleteProperty,
} from "@/services/propertyService.js";

const mock = new MockAdapter(axios);
const API_URL = `${import.meta.env.VITE_URL}${import.meta.env.VITE_PORT}/${
  import.meta.env.VITE_VERSION
}/properties`;

describe("propertyService.js", () => {
  beforeEach(() => {
    mock.reset(); // Reset mock before each test
  });

  afterEach(() => {
    vi.restoreAllMocks(); // Restore mocks after each test
  });

  it("fetchProperties should return property data", async () => {
    const mockData = {
      data: [{ id: 1, formatted_address: "123 Main St" }],
      totalPages: 5,
      currentPage: 1,
    };

    mock.onGet(API_URL).reply(200, mockData);

    const result = await fetchProperties(1, 10, "Main");
    expect(result).toEqual(mockData);
  });

  it("fetchProperties should handle errors", async () => {
    mock.onGet(API_URL).reply(500);

    await expect(fetchProperties()).rejects.toThrow();
  });

  it("addProperty should return success response", async () => {
    const newProperty = { formatted_address: "456 Elm St" };
    const mockResponse = {
      success: true,
      message: "Property added successfully",
    };

    mock.onPost(`${API_URL}/create`).reply(201, mockResponse);

    const result = await addProperty(newProperty);
    expect(result).toEqual(mockResponse);
  });

  it("addProperty should handle errors", async () => {
    mock.onPost(`${API_URL}/create`).reply(400);

    await expect(addProperty({})).rejects.toThrow();
  });

  it("updateProperty should return success response", async () => {
    const updatedProperty = { formatted_address: "789 Oak St" };
    const propertyId = 1;
    const mockResponse = {
      success: true,
      message: "Property updated successfully",
    };

    mock.onPut(`${API_URL}/update/${propertyId}`).reply(200, mockResponse);

    const result = await updateProperty(propertyId, updatedProperty);
    expect(result).toEqual(mockResponse);
  });

  it("updateProperty should handle errors", async () => {
    const propertyId = 999;
    mock.onPut(`${API_URL}/update/${propertyId}`).reply(404);

    await expect(updateProperty(propertyId, {})).rejects.toThrow();
  });

  it("deleteProperty should return success response", async () => {
    const propertyId = 1;
    const mockResponse = {
      success: true,
      message: "Property deleted successfully",
    };

    mock.onDelete(`${API_URL}/delete/${propertyId}`).reply(200, mockResponse);

    const result = await deleteProperty(propertyId);
    expect(result).toEqual(mockResponse);
  });

  it("deleteProperty should handle errors", async () => {
    const propertyId = 999;
    mock.onDelete(`${API_URL}/delete/${propertyId}`).reply(404);

    await expect(deleteProperty(propertyId)).rejects.toThrow();
  });
});
