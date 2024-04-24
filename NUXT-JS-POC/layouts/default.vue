<template>
  <div>
    <div class="p-5 w-full flex items-center justify-center bg-[#efefef]">
      <img
        src="/assets/recipe.png"
        alt="Recipe Icon"
        class="w-12 h-12 block mr-2"
      />
      <h2 class="text-[#450a0a] text-semi-bold text-3xl p-2 block mr-2">
        Recipe Home Page
      </h2>
      <div class="flex items-end justify-end w-[50%]">
        <NuxtLink
          to="/"
          class="p-3 text-[#022c22] font-semibold rounded-md bg-[#e0f2fe] m-2"
        >
          Home
        </NuxtLink>

        <button
          v-if="status === 'authenticated'"
          type="button"
          class="p-3 text-[#022c22] font-semibold rounded-md bg-[#e0f2fe] m-2"
          @click="signOut()"
        >
          Logout
        </button>
        <NuxtLink
          v-else
          to="/login"
          class="p-3 text-[#022c22] font-semibold rounded-md bg-[#e0f2fe] m-2"
        >
          Login/Sign Up
        </NuxtLink>

        <NuxtLink
          to="/create-recipe"
          class="p-3 text-[#022c22] font-semibold rounded-md bg-[#e0f2fe] m-2"
        >
          Create Recipe
        </NuxtLink>

        <NuxtLink
          to="/recipe-update-center"
          class="p-3 text-[#022c22] font-semibold rounded-md bg-[#e0f2fe] m-2"
        >
          Recipe Update Center
        </NuxtLink>
      </div>
    </div>

    <div class="w-[auto] mx-[120px] p-3">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
  const { signOut, status } = useAuth();
</script>

<style></style>
