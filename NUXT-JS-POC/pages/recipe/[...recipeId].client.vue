<template>
  <div>
    Recipe ID: {{ $route.name }}

    <Loading v-if="pending" />
    <p v-else-if="error">Error while loading recipe: {{ error }}</p>
    <!-- <p v-else>{{ recipe }}</p> -->
    <Recipe v-else v-bind="recipe" />
  </div>
</template>

<script lang="ts" setup>
  import type { Recipe } from "~/types/Recipe";

  const recipeId = useRoute().params.recipeId;

  const {
    data: recipe,
    error,
    pending,
  } = useFetch(`/api/v1/recipes/${recipeId}`, {
    lazy: true,
    server: false,
  });
</script>

<style></style>
