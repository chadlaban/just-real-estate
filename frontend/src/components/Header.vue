<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";

const isMenuOpen = ref(false);
const toggleMenu = () => {
  //   console.log("before: ", isMenuOpen.value);
  isMenuOpen.value = !isMenuOpen.value;
  //   console.log("after: ", isMenuOpen.value);
};
</script>

<template>
  <header class="bg-white shadow-md py-4 sticky z-1">
    <div class="container mx-auto flex justify-between items-center px-4">
      <h1 class="text-2xl font-bold text-gray-800">RealEstate</h1>

      <!-- Menu Button for smaller devices-->
      <button
        @click="toggleMenu"
        class="md:hidden text-gray-600 focus:outline-none"
      >
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16m-7 6h7"
          ></path>
        </svg>
      </button>

      <!-- Navigation Menu -->
      <nav
        :class="isMenuOpen ? 'block' : 'hidden'"
        class="fixed top-0 right-0 h-full w-2/3 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:relative md:top-auto md:right-auto md:w-auto md:bg-transparent md:shadow-none md:transform-none md:flex md:space-x-4 p-4 md:p-0"
      >
        <!-- Links -->
        <ul
          class="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 mt-10 md:mt-0"
        >
          <li>
            <router-link to="/" class="text-gray-600 hover:text-gray-900"
              >Home</router-link
            >
          </li>
          <li>
            <router-link
              to="/real-estate-listings"
              class="text-gray-600 hover:text-gray-900"
              >Listings</router-link
            >
          </li>
          <li>
            <router-link
              to="/about-us"
              class="text-gray-600 hover:text-gray-900"
              >About</router-link
            >
          </li>
        </ul>

        <!-- Close Button for smaller devices -->
        <button
          @click="toggleMenu"
          class="absolute top-4 right-4 text-gray-600 md:hidden"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </nav>
    </div>
  </header>
</template>
