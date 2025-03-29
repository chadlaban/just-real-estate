<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";

const props = defineProps({
  images: {
    type: Array,
    required: true,
  },
});

// reactivivity
const images = computed(() => props.images);

const currentIndex = ref(0);
let interval = null;

const nextImage = () => {
  if (images.value.length > 0) {
    currentIndex.value = (currentIndex.value + 1) % images.value.length;
  }
};

// auto-slide on mount
onMounted(() => {
  interval = setInterval(nextImage, 3000);
});

// clear interval
onUnmounted(() => {
  clearInterval(interval);
});
</script>

<template>
  <div class="relative w-full h-[80vh] md:h-[90vh] overflow-hidden">
    <div
      v-for="(image, index) in images"
      :key="index"
      class="absolute inset-0 transition-opacity duration-1000"
      :class="{
        'opacity-100': index === currentIndex,
        'opacity-0': index !== currentIndex,
      }"
    >
      <img
        :src="image"
        alt="Carousel Image"
        class="w-full h-full object-cover"
      />
    </div>
  </div>
</template>

<style scoped>
.transition-opacity {
  transition: opacity 1s ease-in-out;
}
</style>
