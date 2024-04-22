import { PostgresDBClient } from "./db";

export default async function getRecipeById(id: string | number) {
  await PostgresDBClient.init();
  await PostgresDBClient.query("BEGIN");

  const recipesResult = await PostgresDBClient.query(
    "SELECT id,name,recipe_image,description,total_steps,recipe_category FROM recipes WHERE id=$1;",
    [id]
  );
  const recipeStepsResult = await PostgresDBClient.query(
    "SELECT step_id,step, recipe_id,step_details,image_file FROM recipe_steps WHERE recipe_id = $1;",
    [id]
  );
  const ingredientsResult = await PostgresDBClient.query(
    "SELECT id,recipe_id,name,measurement,quantity,image_file FROM ingredients WHERE recipe_id= $1;",
    [id]
  );
  const result = getRightRecipeFormatFromDBFormat(
    recipesResult,
    recipeStepsResult,
    ingredientsResult
  );
  await PostgresDBClient.query("COMMIT");
  return result[0];
}
