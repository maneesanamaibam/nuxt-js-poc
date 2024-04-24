/* eslint-disable @typescript-eslint/no-explicit-any */
import { Recipe } from "../types/recipeType";
import { PostgresDBClient } from "./db";

export default async function createRecipe(recipe: Recipe): Promise<unknown> {
  function getRequiredFormat(): any {
    const { recipeSteps, ingredients } = recipe;
    const recipeStepsAccumulatedValues = [];
    const ingredientsAccumulatedValues = [];
    const accumulatedUnits = [];
    for (const step of recipeSteps) {
      recipeStepsAccumulatedValues.push([
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
        ingredient.measurement,
        ingredient.name,
        ingredient.quantity,
        ingredient.imageFile,
      ]);
    }

    return {
      noOfIngredients: ingredients.length,
      ingredientsValuesOrder: Object.keys(ingredients[0]).length,
      ingredients: ingredientsAccumulatedValues.flat(),
      noOfRecipeSteps: recipeSteps.length,
      recipeStepsValuesOrder: Object.keys(recipeSteps[0]).length,
      recipeSteps: recipeStepsAccumulatedValues.flat(),
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

  const {
    measurementUnits,
    ingredients,
    recipeData,
    recipeSteps,
    noOfRecipeSteps,
    recipeStepsValuesOrder,
    noOfIngredients,
    ingredientsValuesOrder,
  } = getRequiredFormat();

  await PostgresDBClient.init();

  await PostgresDBClient.query("BEGIN");
  const uuidResult = await PostgresDBClient.query("SELECT gen_random_uuid();");
  const generatedRecipeId = uuidResult.rows[0].gen_random_uuid;

  // // INSERT RECIPE CATEGORY
  await PostgresDBClient.query(
    `INSERT INTO recipe_categories(category_name) VALUES($1) ON CONFLICT DO NOTHING;`,
    [recipeData[0]]
  );
  // INSERT RECIPE
  await PostgresDBClient.query(
    `INSERT INTO recipes(id,recipe_category,name, recipe_image, description, total_steps) VALUES($1,$2,$3,$4,$5,$6);`,
    [generatedRecipeId, ...recipeData]
  );

  // INSERT INGREDIENTS
  const getIngredientsQueryValues = (): any => {
    const values = [];
    for (let i = 0; i < noOfIngredients; i++) {
      values.push(
        `($${i * ingredientsValuesOrder + 1},$${
          i * ingredientsValuesOrder + 2
        },$${i * ingredientsValuesOrder + 3},$${
          i * ingredientsValuesOrder + 4
        },'${generatedRecipeId}')`
      );
    }
    return values.join(",");
  };

  const getMeasurementUnitsQueryValues = (): any => {
    const values = [];
    for (let i = 0; i < measurementUnits.length; i++) {
      values.push(`($${i + 1})`);
    }
    return values.join(",");
  };

  await PostgresDBClient.query(
    `INSERT INTO recipe_measurements(unit) VALUES${getMeasurementUnitsQueryValues()} ON CONFLICT (unit) DO NOTHING;`,
    measurementUnits
  );
  await PostgresDBClient.query(
    `INSERT INTO ingredients(measurement, name, quantity, image_file, recipe_id) VALUES${getIngredientsQueryValues()};`,
    ingredients
  );
  // INSERT RECIPE STEPS
  const getRecipesStepsQueryValues = (): any => {
    const values = [];
    for (let i = 0; i < noOfRecipeSteps; i++) {
      values.push(
        `($${i * recipeStepsValuesOrder + 1},$${
          i * recipeStepsValuesOrder + 2
        },$${i * recipeStepsValuesOrder + 3},'${generatedRecipeId}')`
      );
    }
    return values.join(",");
  };
  const recipeStepsQuery = `INSERT INTO recipe_steps(step, step_details, image_file,recipe_id) VALUES${getRecipesStepsQueryValues()};`;
  await PostgresDBClient.query(recipeStepsQuery, recipeSteps);

  //INSERT RECIPE (remaining fields)
  const recipeStepIdsResult = await PostgresDBClient.query(
    `SELECT step_id FROM recipe_steps WHERE recipe_id=$1;`,
    [generatedRecipeId]
  );
  const recipeStepIds = recipeStepIdsResult.rows.map((row) => row.step_id);
  const ingredientsResult = await PostgresDBClient.query(
    `SELECT name FROM ingredients WHERE recipe_id=$1;`,
    [generatedRecipeId]
  );
  const ingredientNames = ingredientsResult.rows.map((row) => row.name);
  const result = await PostgresDBClient.query(
    `UPDATE recipes SET recipe_steps=$1,ingredients=$2 WHERE id=$3 RETURNING *;`,
    [recipeStepIds, ingredientNames, generatedRecipeId]
  );
  await PostgresDBClient.query("COMMIT");
  return result.rows;
}
