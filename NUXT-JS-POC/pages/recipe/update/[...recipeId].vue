<template>
  <div>update recipe</div>

  <!-- <pre> {{ recipe }}</pre> -->
  <RecipeForm
    :formValues="(recipe as RecipeFormProps)"
    :externalFormDataHandler="recipeFormExternalHandlerFunction"
  />
</template>

<script lang="ts" setup>
  import type { RecipeFormProps } from "~/types/Recipe";

  const recipeId = useRoute().params.recipeId as string;

  const { getRecipeById, updateRecipeById } = useRecipeStore();

  async function recipeFormExternalHandlerFunction(recipeFormData: FormData) {
    await updateRecipeById(recipeFormData, recipeId);
  }

  const recipe = await getRecipeById(recipeId);
</script>

<style></style>
