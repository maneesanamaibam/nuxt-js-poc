<template>
  <RecipeForm
    :externalFormDataHandler="createRecipeFormDataExternalHandlerFunction"
  />
</template>

<script setup lang="ts">
  definePageMeta({
    middleware: "auth",
  });

  const { createNewRecipe } = useRecipeStore();

  async function createRecipeFormDataExternalHandlerFunction(
    newRecipeFormData: FormData
  ) {
    await createNewRecipe(newRecipeFormData);
  }
</script>
