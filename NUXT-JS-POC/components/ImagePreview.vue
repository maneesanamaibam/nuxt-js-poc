<template>
  <div
    class="max-w-screen-lg min-w-[650px] mx-auto bg-white p-8 rounded-md shadow-md"
  >
    <h2 class="text-2xl font-bold mb-4">{{ previewName }} Preview</h2>

    <div class="flex items-center justify-center mb-6 overflow-hidden">
      <img
        :src="imageUrl"
        alt="Image Preview"
        class="rounded-md shadow-md min-w-[250px] min-h-[300px] max-h-72 overflow-hidden"
      />
    </div>

    <div>
      <h3 class="text-lg font-semibold mb-2">Details:</h3>
      <ul>
        <li
          v-for="[property, value] in Object.entries(properties)"
          :key="property"
          class="flex items-center space-x-4"
        >
          <span v-capitalize class="text-gray-700 font-medium"
            >{{ property.split("_").join(" ").toLowerCase() }}:</span
          >
          <span class="text-gray-900">{{ value }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
  import type { ImagePreviewProps } from "~/types/ImagePreview";

  const { imageFile, previewName, properties } = withDefaults(
    defineProps<ImagePreviewProps>(),
    {
      imageFile: "https://via.placeholder.com/150",
    }
  );

  const imageUrl: string =
    imageFile instanceof File ? await getFileAsDataUrl(imageFile) : imageFile;
</script>
