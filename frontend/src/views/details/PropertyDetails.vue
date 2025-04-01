<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import Carousel from "@/components/Carousel.vue";
import image1 from "@/assets/images/carousel/1.jpg";
import image2 from "@/assets/images/carousel/2.jpg";
import image3 from "@/assets/images/carousel/3.jpg";
import image4 from "@/assets/images/carousel/4.jpg";

const images = [image1, image2, image3, image4];
const route = useRoute();
const propertyDetails = ref(null);
const similarProperties = ref(null);

const fetchPropertyDetails = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_URL + import.meta.env.VITE_PORT}/${
        import.meta.env.VITE_VERSION
      }/properties/details/${route.params.id}`
    );
    // console.log("response: ", response.data.property);
    propertyDetails.value = response.data.property;
    similarProperties.value = response.data.similarProperties;
  } catch (error) {
    console.error("Error fetching property details:", error);
    propertyDetails.value = {};
  }
};

onMounted(() => fetchPropertyDetails());
</script>

<template>
  <div class="container mx-auto p-4">
    <p v-if="!propertyDetails" class="text-gray-600">
      Loading property details...
    </p>

    <div v-else>
      <div class="flex flex-col lg:flex-row gap-4">
        <!-- Left Column -->
        <div class="lg:w-2/3 flex flex-col gap-4">
          <Carousel :images="images" />
          <div>
            <iframe
              v-if="propertyDetails.latitude && propertyDetails.longitude"
              :src="`https://www.google.com/maps?q=${propertyDetails.latitude},${propertyDetails.longitude}&output=embed`"
              class="w-full h-64 rounded-lg shadow-md"
              allowfullscreen
            ></iframe>
            <p v-else class="text-gray-500">Map data not available</p>
          </div>
        </div>

        <!-- Right Column -->
        <div class="lg:w-1/3 bg-[#f7f7f7] p-4 rounded-lg shadow-md">
          <section>
            <h2 class="text-xl font-semibold mb-2">Property Information</h2>
            <table class="w-full text-sm text-gray-700 mb-2">
              <tbody>
                <tr v-if="propertyDetails.formatted_address">
                  <td class="font-semibold pr-4">Address:</td>
                  <td>{{ propertyDetails.formatted_address }}</td>
                </tr>
                <tr v-if="propertyDetails.city">
                  <td class="font-semibold pr-4">City:</td>
                  <td>{{ propertyDetails.city }}</td>
                </tr>
                <tr v-if="propertyDetails.state">
                  <td class="font-semibold pr-4">State:</td>
                  <td>{{ propertyDetails.state }}</td>
                </tr>
                <tr v-if="propertyDetails.zip_code">
                  <td class="font-semibold pr-4">Zip Code:</td>
                  <td>{{ propertyDetails.zip_code }}</td>
                </tr>
                <tr v-if="propertyDetails.bedrooms">
                  <td class="font-semibold pr-4">Bedrooms:</td>
                  <td>{{ propertyDetails.bedrooms }}</td>
                </tr>
                <tr v-if="propertyDetails.bathrooms">
                  <td class="font-semibold pr-4">Bathrooms:</td>
                  <td>{{ propertyDetails.bathrooms }}</td>
                </tr>
                <tr v-if="propertyDetails.square_footage">
                  <td class="font-semibold pr-4">Square Footage:</td>
                  <td>{{ propertyDetails.square_footage }} sq ft</td>
                </tr>
                <tr v-if="propertyDetails.year_built">
                  <td class="font-semibold pr-4">Year Built:</td>
                  <td>{{ propertyDetails.year_built }}</td>
                </tr>
                <tr v-if="propertyDetails.property_type">
                  <td class="font-semibold pr-4">Property Type:</td>
                  <td>{{ propertyDetails.property_type }}</td>
                </tr>
                <tr v-if="propertyDetails.last_sale_date">
                  <td class="font-semibold pr-4">Last Sale Date:</td>
                  <td>{{ propertyDetails.last_sale_date }}</td>
                </tr>
                <tr v-if="propertyDetails.assessor_id">
                  <td class="font-semibold pr-4">Assessor ID:</td>
                  <td>{{ propertyDetails.assessor_id }}</td>
                </tr>
                <tr v-if="propertyDetails.legal_description">
                  <td class="font-semibold pr-4">Legal Description:</td>
                  <td>{{ propertyDetails.legal_description }}</td>
                </tr>
                <tr v-if="propertyDetails.subdivision">
                  <td class="font-semibold pr-4">Subdivision:</td>
                  <td>{{ propertyDetails.subdivision }}</td>
                </tr>
              </tbody>
            </table>
            <button
              class="bg-gray-500 w-full text-[#f7f7f7] px-2 py-1 rounded-lg shadow hover:bg-gray-600 cursor-pointer transition-transform transform hover:scale-95"
            >
              Email Agent
            </button>
          </section>

          <!-- Similar Properties -->
          <div v-if="similarProperties.length" class="mt-6">
            <h3 class="text-lg font-semibold mb-2">Similar Properties</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                v-for="(property, index) in similarProperties"
                :key="index"
                class="border rounded-lg p-3 shadow-sm bg-gray-50"
              >
                <router-link
                  :to="{
                    name: 'property-details',
                    params: { id: property.id },
                  }"
                  :key="property.id"
                  target="_blank"
                >
                  <p class="font-semibold">{{ property.formatted_address }}</p>
                  <p class="text-sm text-gray-600">
                    <strong>Bedrooms:</strong> {{ property.bedrooms }} |
                    <strong>Bathrooms:</strong> {{ property.bathrooms }} |
                    <strong>Size:</strong> {{ property.square_footage }} sq ft
                  </p>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
