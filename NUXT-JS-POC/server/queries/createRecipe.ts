import { Recipe } from "../types/recipeType";
import { PostgresDBClient } from "./db";

export default async function createRecipe(recipe: Recipe) {
  function getRequiredFormat() {
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

  const createTablesQuery = `
  DO $$
  BEGIN
      -- Create recipe_measurements table

      CREATE TABLE IF NOT EXISTS recipe_measurements (
          unit VARCHAR(100) PRIMARY KEY UNIQUE NOT NULL
          );

      -- Create recipe_steps table
      CREATE TABLE IF NOT EXISTS recipe_steps (
          step_id   UUID UNIQUE DEFAULT gen_random_uuid() PRIMARY KEY,
          step SMALLINT CONSTRAINT step_should_be_positive_value CHECK(step > 0),
          recipe_id UUID,
          step_details VARCHAR(1000) NOT NULL,
          image_file BYTEA DEFAULT NULL   
      );

      -- Create recipes table
      CREATE TABLE IF NOT EXISTS  recipes (
          id  UUID DEFAULT gen_random_uuid() PRIMARY KEY ,
          name   VARCHAR(255) NOT NULL,
          recipe_image BYTEA DEFAULT NULL,
          description VARCHAR(1000) NOT NULL,
          total_steps  INTEGER NOT NULL,
          recipe_category VARCHAR(255) NOT NULL ,
          ingredients TEXT[],
          recipe_steps UUID[]
      );
      -- Create ingredients table

      CREATE TABLE IF NOT EXISTS ingredients (
          id UUID UNIQUE  DEFAULT gen_random_uuid() PRIMARY KEY ,
          recipe_id UUID,
          name  VARCHAR(255) NOT NULL,
          measurement VARCHAR(100),
          quantity SMALLINT,
          image_file BYTEA DEFAULT NULL         
      );

      -- Create recipe_categories table

      CREATE TABLE IF NOT EXISTS recipe_categories(
          category_name VARCHAR(255) UNIQUE NOT NULL,
          description VARCHAR(1000)
      );

      -- Alter ingredients table to add foreign key constraints

      ALTER TABLE ingredients DROP CONSTRAINT IF EXISTS recipe_measurements_fk, DROP CONSTRAINT IF EXISTS recipe_fk;
      ALTER TABLE ingredients ADD CONSTRAINT recipe_fk FOREIGN KEY(recipe_id) REFERENCES recipes(id) ON DELETE CASCADE ON UPDATE CASCADE;
  
      -- Alter recipe_steps table to add foreign key constraint
      ALTER TABLE recipe_steps DROP CONSTRAINT IF EXISTS recipe_fk;
      ALTER TABLE recipe_steps ADD  CONSTRAINT recipe_fk FOREIGN KEY(recipe_id) REFERENCES recipes(id) ON DELETE CASCADE ON UPDATE CASCADE;
  
      -- Alter recipes table to add foreign key constraints
      ALTER TABLE recipes DROP CONSTRAINT IF EXISTS recipe_category_fk;
      ALTER TABLE recipes ADD CONSTRAINT recipe_category_fk FOREIGN KEY(recipe_category) REFERENCES recipe_categories(category_name) ON DELETE CASCADE ON UPDATE CASCADE;
     
  END;
  $$;
  `;

  await PostgresDBClient.init();
  await PostgresDBClient.query(createTablesQuery);

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
  const getIngredientsQueryValues = () => {
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

  const getMeasurementUnitsQueryValues = () => {
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
  const getRecipesStepsQueryValues = () => {
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
