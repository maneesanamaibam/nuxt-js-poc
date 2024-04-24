/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryResult } from "pg";

export default function (
  recipesResult: QueryResult<any>,
  recipeStepsResult: QueryResult<any>,
  ingredientsResult: QueryResult<any>
): any[] {
  const result = [];
  for (const recipe of recipesResult.rows) {
    const temp: any = {};
    temp.id = recipe.id;
    temp.name = recipe.name;
    temp.description = recipe.description;
    temp.totalSteps = recipe.total_steps;
    temp.recipeCategory = recipe.recipe_category;
    temp.recipeImage = `data:image/png;base64, ${Buffer.from(
      recipe.recipe_image
    ).toString("base64")}`;
    temp.steps = recipeStepsResult.rows
      .filter((step) => step.recipe_id === recipe.id)
      .map((step) => {
        return {
          stepId: step.step_id,
          step: step.step,
          stepDetails: step.step_details,
          recipeId: step.recipe_id,
          imageFile: step.image_file
            ? `data:image/png;base64, ${Buffer.from(step.image_file).toString(
                "base64"
              )}`
            : null,
        };
      });
    temp.ingredients = ingredientsResult.rows
      .filter((ingredient) => ingredient.recipe_id === recipe.id)
      .map((ingredient) => {
        return {
          id: ingredient.id,
          recipeId: ingredient.recipe_id,
          name: ingredient.name,
          measurement: ingredient.measurement,
          quantity: ingredient.quantity,
          imageFile: ingredient.image_file
            ? `data:image/png;base64, ${Buffer.from(
                ingredient.image_file
              ).toString("base64")}`
            : null,
        };
      });

    result.push(temp);
  }
  return result;
}
