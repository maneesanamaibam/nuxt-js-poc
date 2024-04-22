<template>
  <div>update recipe</div>

  <!-- <pre> {{ recipe }}</pre> -->
  <CreateRecipeForm :formValues="recipe" />
</template>

<script lang="ts" setup>
  const recipeId = useRoute().params.recipeId;

  const { getRecipeById } = useRecipeStore();
  const recipe = await getRecipeById(recipeId);
  console.log(recipe);
</script>

<style></style>
