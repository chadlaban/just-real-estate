<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import debounce from "lodash/debounce";
import Pagination from "@/components/Pagination.vue";
import staticImg from "@/assets/images/listing/static-img.jpg";

const properties = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const searchQuery = ref("");
const sortBy = ref("");
const limit = ref(10);
let abortController = null;

const fetchProperties = async (page = 1) => {
  if (abortController) abortController.abort();
  abortController = new AbortController();
  const signal = abortController.signal;

  try {
    const response = await axios.get(
      `${import.meta.env.VITE_URL + import.meta.env.VITE_PORT}/${
        import.meta.env.VITE_VERSION
      }/properties`,
      {
        params: {
          page,
          limit: limit.value,
          search: searchQuery.value.trim(),
          sort_by: sortBy.value,
          order: "DESC",
        },
        signal,
      }
    );

    properties.value = response.data.data;
    totalPages.value = response.data.totalPages;
    currentPage.value = response.data.currentPage;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request canceled:", error.message);
    } else {
      console.error("Error fetching properties:", error);
    }
  }
};

const debouncedFetch = debounce((value) => {
  fetchProperties(1, value); // page reset when searching
}, 500);

watch(searchQuery, (newValue) => {
  debouncedFetch(newValue);
});

onMounted(() => fetchProperties());
</script>

<template>
  <div class="container mx-auto p-5">
    <div class="text-center py-10">
      <h1 class="text-3xl font-bold">Available Properties</h1>
    </div>

    <!-- Filters -->
    <div class="mb-6 flex justify-center gap-2">
      <!-- search -->
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by address..."
        class="border p-2 rounded w-full max-w-md"
      />
      <!-- sort -->
      <select
        v-model="sortBy"
        @change="fetchProperties(1)"
        class="border p-2 rounded"
      >
        <option value="">Sort By</option>
        <option value="createdAt">Real Estate</option>
        <option value="last_sale_date">Last Sale Date</option>
        <option value="property_type">Property Type</option>
      </select>
      <!-- limit -->
      <select
        v-model="limit"
        @change="fetchProperties(1)"
        class="border p-2 rounded"
      >
        <option value="10">Show 10</option>
        <option value="25">Show 25</option>
        <option value="50">Show 50</option>
      </select>
    </div>

    <!-- Properties -->
    <div
      v-if="properties.length"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
    >
      <div
        v-for="property in properties"
        :key="property.id"
        class="border rounded-lg shadow-lg bg-white"
      >
        <img
          :src="staticImg"
          alt="Property Image"
          class="w-full h-50 object-cover rounded-t-md"
        />
        <section
          class="p-4 grid grid-cols-1 sm:grid-cols-2 gap-x-4 text-sm text-gray-700"
        >
          <div>
            <p><strong>Address:</strong> {{ property.formatted_address }}</p>
            <p>
              <strong>City:</strong> {{ property.city }}, {{ property.state }}
              {{ property.zip_code }}
            </p>
            <!-- <p><strong>County:</strong> {{ property.county || "N/A" }}</p>
            <p><strong>Latitude:</strong> {{ property.latitude }}</p>
            <p><strong>Longitude:</strong> {{ property.longitude }}</p> -->
          </div>
          <div>
            <p v-if="property.bedrooms">
              <strong>Bedrooms:</strong> {{ property.bedrooms }}
            </p>
            <p v-if="property.bathrooms">
              <strong>Bathrooms:</strong> {{ property.bathrooms }}
            </p>
            <p v-if="property.square_footage">
              <strong>Size:</strong> {{ property.square_footage }} sq ft
            </p>
            <p v-if="property.lot_size">
              <strong>Lot Size:</strong> {{ property.lot_size }}
            </p>
            <p v-if="property.year_built">
              <strong>Year Built:</strong> {{ property.year_built || "N/A" }}
            </p>
          </div>
        </section>
      </div>
    </div>

    <p v-else class="text-center">Loading properties...</p>

    <Pagination
      :currentPage="currentPage"
      :totalPages="totalPages"
      @page-change="fetchProperties"
    />
  </div>
</template>
