<script setup>
import { computed, defineProps, defineEmits } from "vue";

const props = defineProps({
  currentPage: Number,
  totalPages: Number,
});

const emit = defineEmits(["page-change"]);

const maxVisiblePages = 5;

const startPage = computed(() => Math.max(1, props.currentPage - 2));
const endPage = computed(() =>
  Math.min(props.totalPages, startPage.value + maxVisiblePages - 1)
);

const visiblePages = computed(() => {
  let pages = [];
  for (let i = startPage.value; i <= endPage.value; i++) {
    pages.push(i);
  }
  return pages;
});

const changePage = (page) => {
  if (page >= 1 && page <= props.totalPages) {
    emit("page-change", page);
  }
};

const buttonClass = (page) => [
  "px-4 py-2 rounded",
  props.currentPage === page ? "bg-blue-500 text-[#f7f7f7]" : "bg-gray-300",
];
</script>

<template>
  <div class="flex justify-center mt-5 flex-wrap gap-2">
    <!-- Prev Button -->
    <button
      @click="changePage(currentPage - 1)"
      :disabled="currentPage === 1"
      class="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
    >
      Prev
    </button>

    <!-- First Page Button -->
    <button v-if="startPage > 1" @click="changePage(1)" :class="buttonClass(1)">
      1
    </button>

    <!-- Ellipsis before -->
    <span v-if="startPage > 2" class="px-2">...</span>

    <!-- Pages -->
    <button
      v-for="page in visiblePages"
      :key="page"
      @click="changePage(page)"
      :class="buttonClass(page)"
    >
      {{ page }}
    </button>

    <!-- Ellipsis after -->
    <span v-if="endPage < totalPages - 1" class="px-2">...</span>

    <!-- Last Page Button -->
    <button
      v-if="endPage < totalPages"
      @click="changePage(totalPages)"
      :class="buttonClass(totalPages)"
    >
      {{ totalPages }}
    </button>

    <!-- Next Button -->
    <button
      @click="changePage(currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
    >
      Next
    </button>
  </div>
</template>
