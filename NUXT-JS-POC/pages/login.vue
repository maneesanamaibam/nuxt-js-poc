<template>
  <div
    class="bg-white shadow-md max-w-[700px] m-auto mt-4 py-3 flex justify-center"
  >
    <div
      class="border-[1px] border-secondary-vanilla-100 py-4 w-[95%] flex flex-col justify-center items-center mx-0"
    >
      <h4
        class="text-2xl uppercase font-semibold text-secondary-moonstone-200 underline"
      >
        Login
      </h4>
      <div
        class="rounded p-8 mb-4 max-w-md flex items-center flex-col mt-4 gap-4 justify-center"
      >
        <button
          class="bg-secondary-moonstone-200 hover:bg-secondary-moonstone-150 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          @click="signIn('github')"
        >
          Sign in with Github
        </button>

        <span class="text-xl"> OR </span>
        <button
          class="bg-secondary-moonstone-200 hover:bg-secondary-moonstone-150 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          @click="signIn('google')"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  definePageMeta({
    middleware: "guest-only",
    auth: { authenticatedRedirectTo: "/" },
  });
  const { signIn } = useAuth();
</script>

<style></style>
