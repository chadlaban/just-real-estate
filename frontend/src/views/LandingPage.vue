<script setup>
import { RouterLink } from "vue-router";
import Carousel from "@/components/Carousel.vue";
import image1 from "@/assets/images/carousel/1.jpg";
import image2 from "@/assets/images/carousel/2.jpg";
import image3 from "@/assets/images/carousel/3.jpg";
import image4 from "@/assets/images/carousel/4.jpg";
import sellImage from "@/assets/images/landingpage/sell.jpg";
import buyImage from "@/assets/images/landingpage/buy.jpg";

// images for the carousel
const images = [image1, image2, image3, image4];
</script>

<template>
  <!-- Main Section -->
  <Carousel :images="images" />

  <div class="container mx-auto px-4">
    <section class="text-center py-10">
      <h1 class="text-3xl md:text-4xl font-bold">Welcome to RealEstate</h1>
      <p class="mt-4 text-gray-600">Find your dream home with us.</p>
    </section>

    <!-- Sub-sections -->
    <section
      class="flex flex-col md:flex-row gap-2 md:gap-6 w-full h-[500px] md:h-[600px]"
    >
      <!-- Sell Section -->
      <div class="relative flex-1 h-full rounded-lg shadow-md overflow-hidden">
        <img
          :src="sellImage"
          alt="Sell Properties"
          class="absolute inset-0 w-full h-full object-cover"
        />
        <div
          class="absolute inset-0 flex items-center justify-center bg-black/[.5] text-white text-center p-6"
        >
          <div>
            <h2 class="text-2xl font-semibold">Sell a Property?</h2>
            <p class="mt-2">Experience and trust in real estate.</p>
          </div>
        </div>
      </div>

      <!-- Buy Section -->
      <div class="relative flex-1 h-full rounded-lg shadow-md overflow-hidden">
        <img
          :src="buyImage"
          alt="Buy Properties"
          class="absolute inset-0 w-full h-full object-cover"
        />
        <div
          class="absolute inset-0 flex items-center justify-center bg-black/[.5] text-white text-center p-6"
        >
          <div>
            <h2 class="text-2xl font-semibold">Buy a Home?</h2>
            <p class="mt-2">Explore the best properties available.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="text-center py-10">
      <router-link to="/real-estate-listings">
        <h1 class="text-3xl md:text-4xl font-bold">Checkout our Listings!</h1>
        <p class="mt-4 text-gray-600">
          Currently available and ready to mingle.
        </p>
      </router-link>
    </section>
  </div>
</template>
