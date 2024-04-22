export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("capitalize", {
    beforeMount(ele) {
      const str = ele.textContent;
      ele.textContent = str.charAt(0).toUpperCase() + str.slice(1);
    },
  });
});
