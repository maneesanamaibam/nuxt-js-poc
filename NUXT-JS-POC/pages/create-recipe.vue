<template>
  <CreateRecipeForm />
</template>

<script setup lang="ts">
  definePageMeta({
    middleware: "auth",
  });
</script>
