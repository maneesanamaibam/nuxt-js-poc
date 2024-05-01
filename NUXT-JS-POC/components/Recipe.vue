<template>
  <div
    class="max-w-4xl mx-auto p-8 rounded-md shadow-md bg-secondary-baby-powder-50 text-secondary-moonstone-200"
  >
    <div class="mb-6">
      <h2 class="text-3xl font-bold mb-4 font-serif tracking-wide text-center">
        {{ name }}
      </h2>

      <div>
        <span
          class="p-2 text-xl font-sans recipe-badge-gradient text-white p-2"
        >
          Recipe Image
        </span>
        <div class="p-1 my-4 bg-white border-primary-blue-200 border-[1px]">
          <img
            :src="recipeImage"
            alt="Recipe Image"
            class="w-full h-auto rounded-md shadow-md my-4"
          />
        </div>
      </div>
    </div>
    <div class="p-2 pl-0 mb-3">
      <!-- bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500  -->
      <span
        class="mr-3 recipe-badge-gradient text-white p-2 uppercase font-semibold"
      >
        Recipe Category:
      </span>
      <span class="p-2 text-center font-semibold">
        {{ recipeCategory }}
      </span>
    </div>

    <div
      class="mb-6 bg-white p-4 pt-2 pl-6 border-primary-blue-200 border-[1px]"
    >
      <h3 class="text-xl font-semibold mb-2 py-2">Description:</h3>
      <p class="text-gray-700 pb-3 italic">
        {{ description }}
      </p>
    </div>

    <div class="mb-6">
      <h3
        class="text-xl font-semibold recipe-badge-gradient text-white w-[120px] p-2 mb-2"
      >
        Ingredients
      </h3>
      <div class="flex flex-col gap-2">
        <div
          v-for="(ingredient, i) in ingredients"
          :key="ingredient.id"
          class="w-full mt-3 p-2 border-secondary-moonstone-200 border-[1px] flex justify-between bg-white"
        >
          <div class="min-w-[200px] p-2">
            <p>Ingredient {{ i + 1 }}</p>
            <p class="text-gray-700">
              Name of the ingredient: {{ ingredient.name }}
            </p>
            <p class="text-gray-700">
              Quantity: {{ ingredient.quantity }} {{ ingredient.measurement }}
            </p>
          </div>

          <img
            :src="ingredient.imageFile"
            alt="Ingredient Image"
            class="w-[300px] h-[250px] rounded-md shadow-md"
          />
        </div>
      </div>
    </div>

    <div>
      <h3
        class="text-xl font-semibold font-sans recipe-badge-gradient text-white p-2 max-w-[300px] w-auto my-3"
      >
        How to make {{ name }}
      </h3>
      <p class="text-md">Total number of recipe steps: {{ totalSteps }}</p>

      <div
        v-for="step in steps"
        :key="step.stepId"
        class="w-full mt-3 p-2 border-secondary-moonstone-200 border-[1px] flex justify-between bg-white"
      >
        <!-- Image for step -->
        <div>
          <h4 class="text-2xl my-2">Step {{ step.step }}</h4>

          <p class="text-gray-700 pb-3 italic">
            {{ step.stepDetails }}
          </p>
        </div>

        <img
          :src="step.imageFile"
          alt="Step Image"
          class="w-[300px] h-[250px] rounded-md shadow-md"
        />
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
