import type { Recipe, RecipeCard } from "~/types/Recipe";

export const useRecipeStore = defineStore("recipe-store", () => {
  const recipes = ref<Recipe[]>([]);
  const recipeCardData = ref<RecipeCard[]>([]);
  const _recipeCardDataReference = ref<RecipeCard[]>([]);
  const recipeCategories = computed(() => {
    const temp: string[] = [];
    _recipeCardDataReference.value.forEach((recipe: RecipeCard) => {
      if (!temp.includes(recipe.recipeCategory)) {
        temp.push(recipe.recipeCategory);
      }
    });
    return temp;
  });

  async function getAllRecipes() {
    const { data, error, pending } = await useAsyncData("item", () =>
      $fetch<{ recipes: Recipe[] }>("/api/v1/recipes/all")
    );

    if (data.value) {
      recipes.value = data.value.recipes;
      recipeCardData.value = data.value.recipes.map(
        ({ id, name, description, recipeImage, recipeCategory }: Recipe) => {
          // add tag names
          return {
            id,
            name,
            description,
            recipeImage,
            recipeCategory,
          };
        }
      );
      _recipeCardDataReference.value = recipeCardData.value;
    }
  }

  function filterRecipeCards(
    searchText: string,
    filterByTagName: boolean = false
  ) {
    recipeCardData.value = _recipeCardDataReference.value.filter((recipe) => {
      if (searchText === "ALL") {
        return true;
      }
      if (filterByTagName) {
        return recipe.recipeCategory
          .toLowerCase()
          .includes(searchText.toLowerCase());
      }
      return (
        recipe.name.toLowerCase().includes(searchText.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchText.toLowerCase())
      );
    });
  }

  async function deleteRecipeById(id: string) {
    try {
      const result = await $fetch(`/api/v1/recipes/${id}/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Deleting recipe: ", result);
      await getAllRecipes();
    } catch (err) {
      console.log("Error deleting recipe: ", err);
    }
  }

  async function getRecipeById(id: string) {
    if (recipes.value.length === 0) {
      await getAllRecipes();
    }
    return recipes.value.find((recipe) => recipe.id === id);
  }

  async function createNewRecipe(newRecipeData: FormData) {
    const { error } = await useFetch("/api/v1/recipes/create", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: newRecipeData,
      redirect: "follow",
      lazy: true,
      server: false,
    });
    if (error.value) {
      throw error.value;
    }
  }

  async function updateRecipeById(
    updatedRecipeData: FormData,
    recipeId: string
  ) {
    const { error } = await useFetch(`/api/v1/recipes/${recipeId}/update`, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: updatedRecipeData,
      redirect: "follow",
      lazy: true,
      server: false,
    });
    if (error.value) {
      throw error.value;
    }
  }

  return {
    recipes,
    getAllRecipes,
    recipeCardData,
    filterRecipeCards,
    deleteRecipeById,
    recipeCategories,
    getRecipeById,
    createNewRecipe,
    updateRecipeById,
  };
});
