<template>
  <div class="flex justify-center items-center mb-4 gap-5">
    <div>
      <span
        class="inline-block bg-primary-red-150 text-white text-xs font-semibold px-3 py-2 m-2 uppercase rounded-lg hover:cursor-pointer"
        @click="filterRecipeCards('ALL')"
        >ALL</span
      >
      <span
        v-for="tag in recipeCategories"
        :key="tag"
        class="inline-block bg-secondary-moonstone-100 text-white text-xs font-semibold px-3 py-2 m-2 uppercase rounded-lg hover:cursor-pointer"
        @click="filterRecipeCards(tag)"
        >{{ tag }}</span
      >
    </div>
    <div class="relative">
      <input
        type="text"
        class="block w-full py-2 pl-10 pr-4 leading-tight bg-white border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        placeholder="Search..."
        @input="
          filterRecipeCards(
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
    <!-- {{ recipes }} -->
    <div v-if="recipeCardData.length > 0">
      <RecipeCard
        v-for="recipe in recipeCardData"
        v-bind="recipe"
        :key="recipe.id"
        @click="recipeCardNavigationHandler(recipe.id as string)"
      >
        <template #recipe-card-actions>
          <div class="flex gap-2">
            <button
              class="bg-secondary-vanilla-200 min-w-[120px] text-white p-2 rounded-md"
              @click="deleteRecipe(recipe.id as string)"
            >
              Delete Recipe
            </button>
            <button
              class="bg-secondary-moonstone-150 text-white min-w-[120px] p-2 rounded-md"
              @click="updateRecipe(recipe.id as string)"
            >
              Update Recipe
            </button>
          </div>
        </template>
      </RecipeCard>
    </div>
    <div class="text-xl text-primary-red-100 text-center pt-4" v-else>
      No recipe found !
    </div>
  </div>
  <Loading v-if="isLoading" />
  <!-- <RecipeCard /> -->
</template>

<script setup lang="ts">
  definePageMeta({
    middleware: "auth",
  });
  const isLoading = ref(false);
  const router = useRouter();
  const { getAllRecipes, deleteRecipeById, filterRecipeCards } =
    useRecipeStore();
  const { recipeCardData, recipeCategories } = storeToRefs(useRecipeStore());
  await useAsyncData("recipe-store", () => getAllRecipes().then(() => true));

  function updateRecipe(recipeId: string) {
    router.push({ name: "recipe-update-recipeId", params: { recipeId } });
  }
  function recipeCardNavigationHandler(recipeId: string) {
    router.push({ name: "recipe-recipeId", params: { recipeId } });
  }

  async function deleteRecipe(id: string) {
    isLoading.value = true;
    await deleteRecipeById(id);
    isLoading.value = false;
  }
  onMounted(async () => {
    await getAllRecipes();
  });
</script>

<style></style>
