<template>
  <!-- HTML Structure -->
  <div
    class="fixed inset-0 flex items-center justify-center z-50 overflow-auto bg-black bg-opacity-50"
  >
    <div class="bg-white rounded-lg p-8">
      <!-- Modal Header -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">{{ title }}</h2>
        <button
          class="text-gray-500 hover:text-gray-700 focus:outline-none"
          type="button"
          aria-label="Close modal"
          @click="$emit('modal-close')"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>
      <!-- Modal Content -->
      <slot name="modal-content"> Modal body content goes here... </slot>
      <!-- Modal Footer -->
      <div class="mt-4 flex justify-end">
        <slot name="modal-footer"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  defineEmits(["modal-close"]);
  const { title } = defineProps<{
    title?: string;
  }>();
</script>

<style></style>
