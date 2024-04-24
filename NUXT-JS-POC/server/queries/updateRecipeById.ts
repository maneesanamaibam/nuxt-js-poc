/* eslint-disable @typescript-eslint/no-explicit-any */
import { Recipe } from "../types/recipeType";
import { PostgresDBClient } from "./db";

export default async function updateRecipeById(
  recipeId: string,
  recipe: Recipe
): Promise<unknown> {
  function getRequiredFormat(): any {
    const { recipeSteps, ingredients } = recipe;
    const recipeStepsAccumulatedValues = [];
    const ingredientsAccumulatedValues = [];
    const accumulatedUnits = [];
    for (const step of recipeSteps) {
      recipeStepsAccumulatedValues.push([
        step.stepId,
        step.step,
        step.stepDetails,
        step.imageFile,
      ]);
    }

    for (const ingredient of ingredients) {
      if (ingredient.measurement) {
        accumulatedUnits.push(ingredient.measurement);
      }
      ingredientsAccumulatedValues.push([
        ingredient.id,
        ingredient.measurement,
        ingredient.name,
        ingredient.quantity,
        ingredient.imageFile,
      ]);
    }

    return {
      noOfIngredients: ingredients.length,
      ingredientsValuesOrder: Object.keys(ingredients[0]).length,
      ingredients: ingredientsAccumulatedValues,
      noOfRecipeSteps: recipeSteps.length,
      recipeStepsValuesOrder: Object.keys(recipeSteps[0]).length,
      recipeSteps: recipeStepsAccumulatedValues,
      measurementUnits: accumulatedUnits,
      recipeData: [
        recipe.recipeCategory,
        recipe.name,
        recipe.recipeImage,
        recipe.description,
        recipe.totalSteps,
      ],
    };
  }

  const { ingredients, recipeData, recipeSteps } = getRequiredFormat();

  PostgresDBClient.init();

  await PostgresDBClient.query("BEGIN");

  const recipeExists = await PostgresDBClient.query(
    "SELECT id from recipes WHERE id=$1;",
    [recipeId]
  );
  if (recipeExists.rows.length === 0) {
    throw new Error("Recipe does not exist.Please check the recipe ID");
  }

  // // INSERT RECIPE CATEGORY
  const recipeCategoryResult = await PostgresDBClient.query(
    "SELECT category_name FROM recipe_categories WHERE category_name=$1;",
    [recipeData[0]]
  );

  if (recipeCategoryResult.rowCount === 0) {
    await PostgresDBClient.query(
      "INSERT INTO recipe_categories (category_name) VALUES ($1);",
      [recipeData[0]]
    );
  } else {
    await PostgresDBClient.query(
      `UPDATE recipe_categories SET category_name=$1;`,
      [recipeData[0]]
    );
  }

  // INSERT RECIPE
  await PostgresDBClient.query(
    `UPDATE recipes SET recipe_category=$2,name=$3, recipe_image=$4, description=$5, total_steps=$6 WHERE id=$1;`,
    [recipeId, ...recipeData]
  );

  // INSERT INGREDIENTS
  const incomingIngredientIds = ingredients.map(
    (ingredient: any) => ingredient[0]
  );

  const existingIngredientIds = await PostgresDBClient.query(
    `SELECT id FROM ingredients WHERE id = ANY($1::uuid[]);`,
    [incomingIngredientIds]
  );

  if (existingIngredientIds.rows.length !== incomingIngredientIds.length) {
    throw new Error("Invalid ingredient IDs provided");
  }

  for (const ingredient of ingredients) {
    // eslint-disable-next-line no-await-in-loop
    await PostgresDBClient.query(
      `UPDATE ingredients SET measurement=$2, name=$3, quantity=$4, image_file=$5 WHERE id=$1;`,
      ingredient
    );
  }

  // INSERT RECIPE STEPS
  const incomingRecipeStepIds = recipeSteps.map(
    (recipeStep: any) => recipeStep[0]
  );
  const existingRecipeStepIds = await PostgresDBClient.query(
    `SELECT step_id FROM recipe_steps WHERE step_id = ANY($1::uuid[]);`,
    [incomingRecipeStepIds]
  );

  if (existingRecipeStepIds.rows.length !== incomingRecipeStepIds.length) {
    throw new Error("Invalid recipe step IDs provided");
  }
  for (const recipeStep of recipeSteps) {
    // eslint-disable-next-line no-await-in-loop
    await PostgresDBClient.query(
      `UPDATE recipe_steps SET step=$2, step_details=$3, image_file=$4 WHERE step_id=$1;`,
      recipeStep
    );
  }

  //INSERT RECIPE (remaining fields)
  const recipeStepIdsResult = await PostgresDBClient.query(
    `SELECT step_id FROM recipe_steps WHERE recipe_id=$1;`,
    [recipeId]
  );
  const recipeStepIds = recipeStepIdsResult.rows.map((row) => row.step_id);
  const ingredientsResult = await PostgresDBClient.query(
    `SELECT name FROM ingredients WHERE recipe_id=$1;`,
    [recipeId]
  );
  const ingredientNames = ingredientsResult.rows.map((row) => row.name);
  const result = await PostgresDBClient.query(
    `UPDATE recipes SET recipe_steps=$1,ingredients=$2 WHERE id=$3 RETURNING *;`,
    [recipeStepIds, ingredientNames, recipeId]
  );
  await PostgresDBClient.query("COMMIT");
  return result.rows;
}
