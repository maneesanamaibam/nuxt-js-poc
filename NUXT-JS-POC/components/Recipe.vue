<template>
  <div class="max-w-lg mx-auto bg-white p-8 rounded-md shadow-md">
    <div class="mb-6">
      <h2 class="text-3xl font-bold mb-2">New Recipe 2</h2>
      <img
        src="/imageUrl"
        alt="Recipe Image"
        class="w-full h-auto rounded-md shadow-md mb-4"
      />
    </div>

    <div class="mb-6">
      <h3 class="text-xl font-semibold mb-2">Description</h3>
      <p class="text-gray-700">This is a new recipe 2</p>
    </div>

    <div class="mb-6">
      <h3 class="text-xl font-semibold mb-2">Ingredients</h3>
      <div class="flex flex-wrap gap-4">
        <div class="w-1/2">
          <div class="mb-2">
            <!-- Image for ingredients -->
            <img
              src="/ingredientImageUrl"
              alt="Ingredient Image"
              class="w-full h-auto rounded-md shadow-md"
            />
          </div>
          <div>
            <p class="text-gray-700">Olive Oil - 3 Ounce</p>
          </div>
        </div>
        <div class="w-1/2">
          <div class="mb-2">
            <!-- Image for ingredients -->
            <img
              src="/ingredientImageUrl"
              alt="Ingredient Image"
              class="w-full h-auto rounded-md shadow-md"
            />
          </div>
          <div>
            <p class="text-gray-700">Ginger - 20 Gram</p>
          </div>
        </div>
        <div class="w-1/2">
          <div class="mb-2">
            <!-- Image for ingredients -->
            <img
              src="/ingredientImageUrl"
              alt="Ingredient Image"
              class="w-full h-auto rounded-md shadow-md"
            />
          </div>
          <div>
            <p class="text-gray-700">Milk - 300 ml</p>
          </div>
        </div>
      </div>
    </div>

    <div>
      <h3 class="text-xl font-semibold mb-2">Steps</h3>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div class="mb-2">
          <!-- Image for step -->
          <img
            src="/stepImageUrl"
            alt="Step Image"
            class="w-full h-auto rounded-md shadow-md"
          />
        </div>
        <div class="mb-2">
          <!-- Image for step -->
          <img
            src="/stepImageUrl"
            alt="Step Image"
            class="w-full h-auto rounded-md shadow-md"
          />
        </div>
      </div>
      <ol class="list-decimal list-inside">
        <li>This is step 1</li>
        <li>This is step 1</li>
      </ol>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style></style>
