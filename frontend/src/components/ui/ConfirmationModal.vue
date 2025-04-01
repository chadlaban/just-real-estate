<script setup>
import { defineProps, defineEmits, ref } from "vue";

defineProps({
  title: String,
  message: String,
  show: Boolean,
});

const emit = defineEmits(["confirm", "cancel"]);

const confirm = () => emit("confirm");
const cancel = () => emit("cancel");
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 flex items-center justify-center bg-[#e6e6e6]/[.5]"
    >
      <div class="bg-[#f7f7f7] rounded-lg p-6 w-96 shadow-lg">
        <h2 class="text-lg font-bold mb-4">{{ title }}</h2>
        <p class="mb-6">{{ message }}</p>
        <div class="flex justify-end space-x-3">
          <button @click="cancel" class="px-4 py-2 bg-gray-300 rounded-md">
            Cancel
          </button>
          <button
            @click="confirm"
            class="px-4 py-2 bg-green-600 text-[#f7f7f7] rounded-md"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
