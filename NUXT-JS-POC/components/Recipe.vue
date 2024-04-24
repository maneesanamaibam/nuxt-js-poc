<template>
  <div class="max-w-3xl mx-auto bg-white p-8 rounded-md shadow-md">
    <div class="mb-6">
      <h2 class="text-3xl font-bold mb-2">{{ name }}</h2>
      <img
        :src="recipeImage"
        alt="Recipe Image"
        class="w-full h-auto rounded-md shadow-md mb-4"
      />
    </div>

    <div class="mb-6">
      <h3 class="text-xl font-semibold mb-2">Description</h3>
      <p class="text-gray-700">{{ description }}</p>
    </div>
    <p>Recipe Category: {{ recipeCategory }}</p>
    <div class="mb-6">
      <h3 class="text-xl font-semibold mb-2">Ingredients</h3>
      <div class="flex flex-wrap gap-4">
        <div
          v-for="ingredient in ingredients"
          :key="ingredient.id"
          class="w-1/2"
        >
          <div class="mb-2">
            <!-- Image for ingredients -->
            <img
              :src="ingredient.imageFile"
              alt="Ingredient Image"
              class="w-full h-auto rounded-md shadow-md"
            />
          </div>
          <div>
            <p class="text-gray-700">{{ ingredient.name }}</p>
            <p class="text-gray-700">
              {{ ingredient.quantity }} -{{ ingredient.measurement }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div>
      <h3 class="text-xl font-semibold mb-2">Steps</h3>
      <p>Total Steps: {{ totalSteps }}</p>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div v-for="step in steps" :key="step.stepId" class="mb-2">
          <!-- Image for step -->
          <img
            :src="step.imageFile"
            alt="Step Image"
            class="w-full h-auto rounded-md shadow-md"
          />

          <ol class="list-decimal list-inside">
            <li>{{ step.stepDetails }}</li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { RecipePageProps } from "~/types/Recipe";

  const {
    description,
    ingredients,
    name,
    totalSteps,
    recipeCategory,
    recipeImage,
    steps,
  } = defineProps<RecipePageProps>();
</script>

<style></style>
