import { createDBTables } from "./server/queries/createTables";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],
  pinia: {
    storesDirs: ["./stores/**"],
  },
  runtimeConfig: {},
  hooks: {
    listen: () => {
      createDBTables();
    },
  },
});
