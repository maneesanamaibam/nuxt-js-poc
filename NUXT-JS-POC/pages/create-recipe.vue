<template>
  <RecipeForm
    :externalFormDataHandler="createRecipeFormDataExternalHandlerFunction"
  />
</template>

<script setup lang="ts">
  definePageMeta({
    middleware: "auth",
  });

  useHead({
    title: "Create Recipe",
  });

  const { createNewRecipe } = useRecipeStore();

  async function createRecipeFormDataExternalHandlerFunction(
    newRecipeFormData: FormData
  ) {
    await createNewRecipe(newRecipeFormData);
  }
</script>
