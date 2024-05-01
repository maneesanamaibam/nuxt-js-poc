<template>
  <div>
    <Loading v-if="pending" />
    <p v-else-if="error">Error while loading recipe: {{ error }}</p>
    <Recipe v-else v-bind="(recipe as RecipePageProps)" />
  </div>
</template>

<script lang="ts" setup>
  import type { RecipePageProps } from "~/types/Recipe";
  definePageMeta({
    middleware: "auth",
  });
  const recipeId = useRoute().params.recipeId;

  const {
    data: recipe,
    error,
    pending,
  } = await useFetch(`/api/v1/recipes/${recipeId}`);

  if (!recipe.value) {
    throw createError({
      statusCode: 404,
      statusMessage: "Recipe Not Found",
      fatal: true,
    });
  }
</script>

<style></style>
