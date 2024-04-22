export default class RecipeService {
  static async createNewRecipe(newRecipeData: any) {
    const { data, pending, error } = await useFetch("/api/v1/recipes/create", {
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
}
