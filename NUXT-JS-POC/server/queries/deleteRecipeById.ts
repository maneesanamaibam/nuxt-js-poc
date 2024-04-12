import { PostgresDBClient } from "./db";

export default async function deleteRecipeById(recipeId: number | string) {
  PostgresDBClient.init();
  const result = await PostgresDBClient.query(
    "DELETE FROM recipes WHERE id = $1",
    [recipeId]
  );

  return result.rows;
}
