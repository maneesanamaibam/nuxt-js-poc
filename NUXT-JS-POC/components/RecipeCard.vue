<template>
  <div
    class="max-w-3xl p-2 mx-auto bg-white rounded-lg shadow-lg overflow-hidden my-2 cursor-pointer"
  >
    <div class="p-4 flex gap-[70px] items-center justify-between">
      <div @click="$attrs.onClick">
        <h2 class="text-xl font-semibold text-gray-800">{{ props.name }}</h2>
        <p class="mt-2 text-gray-600">{{ props.description }}</p>
        <div class="mt-4 flex flex-wrap">
          <span
            class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
            >#{{ props.recipeCategory }}</span
          >
        </div>
      </div>

      <img
        class="w-[150px] h-[150px] object-cover object-center"
        :src="props.recipeImage"
        alt="Recipe Image"
      />
      <slot name="recipe-card-actions"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { RecipeCard } from "~/types/Recipe";

  defineOptions({
    inheritAttrs: false,
  });
  const props = defineProps<RecipeCard>();
</script>

<style></style>
