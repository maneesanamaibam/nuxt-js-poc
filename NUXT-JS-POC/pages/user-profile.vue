<template>
  <div
    class="max-w-[700px] m-auto bg-secondary-baby-powder-50 shadow-md p-4 pt-6 flex flex-col items-center mt-10 rounded-md"
  >
    <h3
      class="text-2xl font-semi-bold text-secondary-moonstone-200 uppercase font-serif underline"
    >
      Your profile details
    </h3>
    <div class="p-4 flex flex-col gap-3">
      <div class="flex items-center">
        <span class="text-label">Photo</span>
        <img :src="user.image" class="m-2 max-w-[150px]" />
      </div>

      <div class="">
        <span class="text-label">Name:</span>
        <span class="text-label-value">{{ user.name }}</span>
      </div>

      <div class="">
        <span class="text-label">Email: </span>
        <span class="text-label-value">{{ user.email }} </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const { user } = useAuth();
  definePageMeta({
    middleware: ["auth"],
  });
</script>

<style scoped>
  .text-label {
    @apply text-xl m-2 text-secondary-vanilla-200;
  }
  .text-label-value {
    @apply text-xl m-2 text-secondary-moonstone-150;
  }
</style>
