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

  for (let recipe of recipesResult.rows) {
    recipe.recipe_image = Buffer.from(recipe.recipe_image).toString("base64");
    recipe.steps = recipeStepsResult.rows.filter(
      (step) => step.recipe_id === recipe.id
    );
    recipe.ingredients = ingredientsResult.rows.filter(
      (ingredient) => ingredient.recipe_id === recipe.id
    );
  }
  await PostgresDBClient.query("COMMIT;");
  return recipesResult.rows;
}
