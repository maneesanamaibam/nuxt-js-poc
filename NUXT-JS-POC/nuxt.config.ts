// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss"],
  runtimeConfig: {
    postgresConnectionStringURL:
      process.env.NUXT_POSTGRES_CONNECTION_STRING_URL || "test",
  },
});
