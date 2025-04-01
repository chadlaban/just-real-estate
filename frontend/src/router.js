import { createRouter, createWebHistory } from "vue-router";
import LandingPage from "./views/LandingPage.vue";
import RealEstateListings from "./views/RealEstateListings.vue";
import About from "./views/About.vue";
import Manage from "./views/management/Manage.vue";
import PropertyDetails from "./views/details/PropertyDetails.vue";

const routes = [
  { path: "/", component: LandingPage },
  { path: "/real-estate-listings", component: RealEstateListings },
  { path: "/about-us", component: About },
  { path: "/management", component: Manage },
  {
    path: "/property/:id",
    name: "property-details",
    component: PropertyDetails,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
