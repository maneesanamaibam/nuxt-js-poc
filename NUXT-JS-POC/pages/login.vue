<template>
  <div class="flex justify-center items-center h-screen bg-gray-100">
    <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-md">
      <div class="mb-4">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="username"
        >
          Username
        </label>
        <input
          id="username"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="Username"
        />
      </div>
      <div class="mb-6">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="password"
        >
          Password
        </label>
        <input
          id="password"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          type="password"
          placeholder="********"
        />
      </div>
      <div class="flex items-center justify-between gap-3 mb-3">
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
        >
          Log In
        </button>
        OR
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          @click="signIn('github')"
        >
          Sign In With Github
        </button>
      </div>

      <NuxtLink
        class="text-[#2d82d6] underline hover:text-blue-700"
        to="/signup"
        >Create an Account</NuxtLink
      >
    </form>
  </div>
</template>

<script lang="ts" setup>
  definePageMeta({
    middleware: "guest-only",
  });
  const { signIn } = useAuth();
</script>

<style></style>
