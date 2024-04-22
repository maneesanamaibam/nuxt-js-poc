<template>
  <div class="max-w-md mx-auto bg-white p-8 rounded-md shadow-md">
    <h2 class="text-2xl font-bold mb-4">{{ previewName }} Preview</h2>

    <div class="flex items-center justify-center mb-6">
      <img :src="imageUrl" alt="Image Preview" class="rounded-md shadow-md" />
    </div>

    <div>
      <h3 class="text-lg font-semibold mb-2">Details:</h3>
      <ul>
        <li
          class="flex items-center space-x-4"
          v-for="[property, value] in Object.entries(properties)"
          :key="property"
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
  interface ImagePreviewProps {
    imageFile?: string | File;
    previewName: string;
    properties: {
      [key: string]: string;
    };
  }
  const { imageFile, previewName, properties } = withDefaults(
    defineProps<ImagePreviewProps>(),
    {
      imageFile: "https://via.placeholder.com/150",
    }
  );

  const imageUrl =
    imageFile instanceof File ? await getFileAsDataUrl(imageFile) : imageFile;
</script>
