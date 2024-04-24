<template>
  <div class="flex justify-center items-center mb-4 gap-5">
    <div>
      <span
        class="inline-block bg-blue-500 text-white text-xs font-semibold px-3 py-2 m-2 uppercase rounded-lg hover:cursor-pointer"
        @click="filterByTagName('ALL')"
        >ALL</span
      >
      <span
        v-for="tag in recipeCategories"
        :key="tag"
        class="inline-block bg-blue-500 text-white text-xs font-semibold px-3 py-2 m-2 uppercase rounded-lg hover:cursor-pointer"
        @click="filterByTagName(tag)"
        >{{ tag }}</span
      >
    </div>
    <div class="relative">
      <input
        class="block w-full py-2 pl-10 pr-4 leading-tight bg-white border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        type="text"
        placeholder="Search..."
        @input="
          filterRecipes(
            ($event.target as HTMLInputElement).value.trim().toLowerCase()
          )
        "
      />
      <div
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
      >
        <svg
          class="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-4.35-4.35M15 11a4 4 0 1 1-8 0 4 4 0 0 1 8 0zm-4 0a2 2 0 1 0-4 0 2 2 0 0 0 4 0z"
          ></path>
        </svg>
      </div>
    </div>
  </div>

  <div>
    <p v-if="isLoading" class="text-center">Loading..."></p>
    <RecipeCard
      v-for="recipe in recipeCardData"
      v-else
      v-bind="recipe"
      :key="recipe.id"
      @click="recipeCardNavigationHandler(recipe.id as string)"
    />
  </div>
  <!-- <RecipeCard /> -->
</template>

<script lang="ts" setup>
  definePageMeta({
    middleware: "auth",
  });

  const router = useRouter();
  const isLoading = ref(false);

  const { getAllRecipes, filterRecipeCards } = useRecipeStore();
  const { recipeCardData, recipeCategories } = storeToRefs(useRecipeStore());
  await useAsyncData("recipe-store", () => getAllRecipes().then(() => true));

  function filterRecipes(recipeSearchText: string) {
    filterRecipeCards(recipeSearchText);
  }

  function filterByTagName(tagName: string) {
    filterRecipeCards(tagName, true);
  }

  function recipeCardNavigationHandler(recipeId: string) {
    router.push({ name: "recipe-recipeId", params: { recipeId } });
  }

  onMounted(async () => {
    isLoading.value = true;
    await getAllRecipes();
    isLoading.value = false;
  });
</script>

<style></style>
