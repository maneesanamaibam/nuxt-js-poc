import createRecipe from "~/server/queries/createRecipe";
import { Recipe } from "~/server/types/recipeType";

export default defineEventHandler(async (event) => {
  const payload: Recipe = {
    recipeSteps: [
      {
        step: 1,
        recipeId: "Pasta",
        stepDetails: "This is 1 recipe step details",
        imageFile: null,
      },
    ],
    name: "New Recipe",
    description: "This is a new recipe",
    recipeImage: null,
    totalSteps: 4,
    recipeCategory: "Breakfast",
    ingredients: [
      {
        imageFile: null,
        measurement: "Teaspoon",
        name: "Olive Oil",
        quantity: 4,
      },
    ],
  };
  try {
    const result = await createRecipe(payload);
    return {
      status: "success",
      message: "Recipe created successfully!",
      recipe: result,
    };
  } catch (err: Error | unknown) {
    const errMsg = err instanceof Error ? err.message : JSON.stringify(err);
    console.log(err);
    setResponseStatus(event, 405, errMsg);
    return {
      status: "error",
      message: errMsg,
    };
  }
});
