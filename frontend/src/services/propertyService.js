import axios from "axios";

const API_URL = `${import.meta.env.VITE_URL}${import.meta.env.VITE_PORT}/${
  import.meta.env.VITE_VERSION
}/properties`;

let abortController = null;

const fetchProperties = async (page = 1, limit = 10, searchQuery = "") => {
  if (abortController) abortController.abort();
  abortController = new AbortController();

  try {
    const response = await axios.get(API_URL, {
      params: { page, limit, search: searchQuery.trim() },
      signal: abortController.signal,
    });

    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request canceled:", error.message);
    } else {
      console.error("Error fetching properties:", error);
    }
    throw error;
  }
};

const addProperty = async (propertyData) => {
  try {
    const response = await axios.post(`${API_URL}/create`, propertyData);
    return response.data;
  } catch (error) {
    console.error("Error adding property:", error);
    throw error;
  }
};

const updateProperty = async (propertyId, propertyData) => {
  try {
    // console.log(propertyId, propertyData);
    const response = await axios.put(
      `${API_URL}/update/${propertyId}`,
      propertyData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating property:", error);
    throw error;
  }
};

const deleteProperty = async (propertyId) => {
  try {
    const response = await axios.delete(`${API_URL}/delete/${propertyId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting property:", error);
    throw error;
  }
};

export { fetchProperties, addProperty, updateProperty, deleteProperty };
