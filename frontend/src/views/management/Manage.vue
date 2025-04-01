<script setup>
import { ref, onMounted, watch } from "vue";
import Pagination from "@/components/Pagination.vue";
import debounce from "lodash/debounce";
import {
  fetchProperties,
  addProperty,
  updateProperty,
  deleteProperty,
} from "@/services/propertyService.js";

const form = ref({
  formatted_address: "",
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  zip_code: null,
  county: "",
  latitude: null,
  longitude: null,
  property_type: "",
  bedrooms: null,
  bathrooms: null,
  square_footage: null,
  lot_size: null,
  year_built: null,
  assessor_id: "",
  legal_description: "",
  subdivision: "",
  last_sale_date: null,
});

const errors = ref({});
const properties = ref([]);
const totalPages = ref(1);
const currentPage = ref(1);
const searchQuery = ref("");
const sortBy = ref("");
const limit = ref(10);
const isEditing = ref(false);
const propertyId = ref();

const resetForm = () => {
  for (const key in form.value) {
    form.value[key] = typeof form.value[key] === "string" ? "" : null;
  }

  isEditing.value = false;
};

const formatLabel = (key) =>
  key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const getInputType = (key) => {
  if (
    [
      "zip_code",
      "latitude",
      "longitude",
      "bedrooms",
      "bathrooms",
      "square_footage",
      "lot_size",
      "year_built",
    ].includes(key)
  ) {
    return "number";
  }
  if (key === "last_sale_date") return "date";
  return "text";
};

const validateForm = () => {
  errors.value = {};
  const decimalRegex = /^-?\d+(\.\d+)?$/;

  const rules = [
    { field: "formatted_address", message: "Formatted address is required." },
    { field: "city", message: "City is required." },
    { field: "state", message: "State is required." },
    {
      field: "zip_code",
      message: "Valid zip code is required.",
      regex: decimalRegex,
    },
    {
      field: "latitude",
      message: "Latitude must be a number.",
      regex: decimalRegex,
    },
    {
      field: "longitude",
      message: "Longitude must be a number.",
      regex: decimalRegex,
    },
  ];

  rules.forEach(({ field, message, regex }) => {
    const value = form.value[field];
    if (!value || (regex && !regex.test(value))) {
      errors.value[field] = message;
    }
  });

  return Object.keys(errors.value).length === 0;
};

const submitForm = async () => {
  if (!validateForm()) return;

  try {
    if (isEditing.value) {
      // console.log(form.value.id, form.value);
      // console.log("updating....");
      form.value.zip_code = form.value.zip_code
        ? Number(form.value.zip_code)
        : null;

      await updateProperty(propertyId.value, form.value);
      isEditing.value = false;
      propertyId.value = null;
      alert("Property updated successfully!");
    } else {
      await addProperty(form.value);
      alert("Property added successfully!");
    }

    resetForm();
    fetchPropertiesData();
  } catch (error) {
    alert("Failed to add property. Check your inputs.");
    console.error(error);
  }
};

const fetchPropertiesData = async (page = 1) => {
  try {
    const data = await fetchProperties(
      page,
      limit.value,
      searchQuery.value,
      sortBy.value
    );
    properties.value = data.data;
    totalPages.value = data.totalPages;
    currentPage.value = data.currentPage;
  } catch (error) {
    console.error("Error fetching properties:", error);
  }
};

const debouncedFetch = debounce((value) => {
  fetchPropertiesData(1, value);
}, 500);

watch(searchQuery, (newValue) => {
  debouncedFetch(newValue);
});

const editProperty = (property) => {
  propertyId.value = property.id;
  isEditing.value = true;

  const {
    id,
    user_id,
    created_by,
    deleted_at,
    deleted_by,
    createdAt,
    updatedAt,
    ...editableFields
  } = property;

  if (editableFields.last_sale_date)
    editableFields.last_sale_date = new Date(editableFields.last_sale_date)
      .toISOString()
      .split("T")[0];

  Object.assign(form.value, editableFields);
};

const deletePropertyHandler = async (id) => {
  if (!confirm("Are you sure you want to delete this property?")) return;

  try {
    await deleteProperty(id);
    fetchPropertiesData();
  } catch (error) {
    alert("Failed to delete property.");
  }
};

onMounted(fetchPropertiesData);
</script>

<template>
  <div class="max-w-full m-10 p-6 bg-white shadow-lg rounded-lg">
    <h2 class="text-2xl font-semibold mb-4 text-center">Manage Properties</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Form Section -->
      <div class="bg-gray-100 p-4 rounded-lg shadow">
        <h3 class="text-xl font-semibold mb-3">
          {{ isEditing ? "Update Property" : "Add New Property" }}
        </h3>
        <form @submit.prevent="submitForm" class="space-y-4">
          <div v-for="(value, key) in form" :key="key" class="form-group">
            <label :for="key" class="block text-sm font-medium text-gray-700">{{
              formatLabel(key)
            }}</label>
            <input
              :type="getInputType(key)"
              :id="key"
              v-model="form[key]"
              :placeholder="formatLabel(key)"
              :step="
                ['latitude', 'longitude'].includes(key) ? 'any' : undefined
              "
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
            <p v-if="errors[key]" class="text-red-500 text-sm mt-1">
              {{ errors[key] }}
            </p>
          </div>
          <!-- Submit/Cancel Button -->
          <button
            type="submit"
            class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-200"
          >
            {{ isEditing ? "Update Property" : "Add Property" }}
          </button>

          <button
            v-if="isEditing"
            type="button"
            @click="resetForm"
            class="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition duration-200 mt-2"
          >
            Cancel
          </button>
          <!-- Submit/Cancel Button -->
        </form>
      </div>

      <!-- List Section -->
      <div class="bg-gray-100 p-4 rounded-lg shadow">
        <h3 class="text-xl font-semibold mb-3">Property List</h3>

        <div class="mb-6 flex justify-center gap-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search properties..."
            class="border p-2 rounded w-full max-w-md"
          />
          <!-- limit -->
          <select
            v-model="limit"
            @change="fetchPropertiesData(1)"
            class="border p-2 rounded"
          >
            <option value="10">Show 10</option>
            <option value="25">Show 25</option>
            <option value="50">Show 50</option>
          </select>
        </div>

        <ul v-if="properties.length" class="space-y-3">
          <li
            v-for="(property, index) in properties"
            :key="index"
            class="bg-white p-3 shadow rounded-md flex justify-between items-center"
          >
            <div>
              <p class="font-semibold">{{ property.formatted_address }}</p>
              <p class="text-sm text-gray-600">
                {{ property.city }}, {{ property.state }}
                {{ property.zip_code }}
              </p>
            </div>
            <div class="flex space-x-2">
              <button
                @click="editProperty(property)"
                class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                @click="deletePropertyHandler(property.id)"
                class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        </ul>

        <p v-else class="text-gray-500">No properties available.</p>

        <Pagination
          :currentPage="currentPage"
          :totalPages="totalPages"
          @page-change="fetchPropertiesData"
        />
      </div>
    </div>
  </div>
</template>
