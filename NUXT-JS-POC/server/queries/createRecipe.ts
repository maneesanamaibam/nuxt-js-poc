import { Recipe } from "../types/recipeType";
import { Pool } from "pg";
import { type Client } from "pg";
import { PostgresDBClient } from "./db";

export default async function createRecipe(recipe: Recipe) {
  const commonRecipeId = crypto.randomUUID();
  const requiredKeys = [
    "measurement",
    "name",
    "quantity",
    "imageFile",
    "step",
    "stepDetails",
    "imageFile",
    "recipeCategory",
    "recipeName",
    "recipeImage",
    "description",
    "totalSteps",
  ];

  function getRequiredFormat(recipe: Recipe) {
    const result = [];
    const { recipeSteps, ingredients } = recipe;
    result[0] = ingredients[0].measurement;
    result[1] = ingredients[0].name;
    result[2] = ingredients[0].imageFile;
    result[3] = ingredients[0].quantity;
    result[4] = recipeSteps[0].step;
    result[5] = recipeSteps[0].stepDetails;
    result[6] = recipeSteps[0].imageFile;
    result[7] = recipe.recipeCategory;
    result[8] = recipe.name;
    result[9] = recipe.recipeImage;
    result[10] = recipe.description;
    result[11] = recipe.totalSteps;

    return result;
  }
  const payload: Recipe = {
    recipeSteps: [
      {
        step: 1,
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

  const createTablesQuery = `
  DO $$
  BEGIN
      -- Create recipe_measurements table

      CREATE TABLE IF NOT EXISTS recipe_measurements (
          unit VARCHAR(100) PRIMARY KEY UNIQUE NOT NULL
          );

      -- Create recipe_steps table
      CREATE TABLE IF NOT EXISTS recipe_steps (
          stepId   UUID UNIQUE DEFAULT gen_random_uuid() PRIMARY KEY,
          step SMALLINT CONSTRAINT step_should_be_positive_value CHECK(step > 0),
          recipeId UUID UNIQUE ,
          stepDetails VARCHAR(1000) NOT NULL,
          imageFile BYTEA DEFAULT NULL   
      );

      -- Create recipes table
      CREATE TABLE IF NOT EXISTS  recipes (
          id  UUID DEFAULT gen_random_uuid() PRIMARY KEY ,
          name   VARCHAR(255) UNIQUE NOT NULL,
          recipeImage BYTEA DEFAULT NULL,
          description VARCHAR(1000) NOT NULL,
          totalSteps  INTEGER NOT NULL,
          recipeCategory VARCHAR(255) NOT NULL ,
          ingredients TEXT[],
          recipeSteps UUID[] NOT NULL
      );
      -- Create ingredients table

      CREATE TABLE IF NOT EXISTS ingredients (
          id UUID UNIQUE  DEFAULT gen_random_uuid() PRIMARY KEY ,
          recipeId UUID UNIQUE,
          name  VARCHAR(255) NOT NULL,
          measurement VARCHAR(100),
          quantity SMALLINT,
          imageFile BYTEA DEFAULT NULL         
      );

      -- Create recipe_categories table

      CREATE TABLE IF NOT EXISTS recipe_categories(
          categoryName VARCHAR(255) UNIQUE NOT NULL,
          description VARCHAR(1000)
      );

      -- Alter ingredients table to add foreign key constraints

      ALTER TABLE ingredients ADD CONSTRAINT recipe_measurements_fk FOREIGN KEY(measurement) REFERENCES recipe_measurements(unit),
      ADD CONSTRAINT recipe_fk FOREIGN KEY(recipeId) REFERENCES recipes(id);
  
      -- Alter recipe_steps table to add foreign key constraint
  
      ALTER TABLE recipe_steps ADD  CONSTRAINT recipe_fk FOREIGN KEY(recipeId) REFERENCES recipes(id);
  
      -- Alter recipes table to add foreign key constraints
      
      ALTER TABLE recipes ADD CONSTRAINT recipe_category_fk FOREIGN KEY(recipeCategory) REFERENCES recipe_categories(categoryName);
     
  END;
  $$;
  `;

  //   const createTablesQuery = `
  // DO $$
  // BEGIN
  //     -- Create recipes table

  //     CREATE TABLE IF NOT EXISTS  recipes (
  //         id  UUID DEFAULT gen_random_uuid() PRIMARY KEY ,
  //         name   VARCHAR(255) UNIQUE NOT NULL,
  //         recipeImage BYTEA DEFAULT NULL,
  //         description VARCHAR(1000) NOT NULL,
  //         totalSteps  INTEGER NOT NULL,
  //         recipeCategory VARCHAR(255) NOT NULL ,
  //         ingredients TEXT[],
  //         recipeSteps UUID[] NOT NULL
  //     );

  //     -- Create recipe_measurements table

  //     CREATE TABLE IF NOT EXISTS recipe_measurements (
  //         unit VARCHAR(100) PRIMARY KEY UNIQUE NOT NULL
  //     );

  //     -- Create ingredients table

  //     CREATE TABLE IF NOT EXISTS ingredients (
  //         id UUID UNIQUE DEFAULT gen_random_uuid(),
  //         recipeId UUID UNIQUE,
  //         name  VARCHAR(255) NOT NULL,
  //         measurement VARCHAR(100),
  //         quantity SMALLINT,
  //         imageFile BYTEA DEFAULT NULL
  //     );

  //     -- Create recipe_steps table

  //     CREATE TABLE IF NOT EXISTS recipe_steps (
  //         stepId   UUID UNIQUE DEFAULT gen_random_uuid(),
  //         step SMALLINT CONSTRAINT step_should_be_positive_value CHECK(step > 0),
  //         recipeId UUID UNIQUE ,
  //         stepDetails VARCHAR(1000) NOT NULL,
  //         imageFile BYTEA DEFAULT NULL
  //     );

  //     -- Create recipe_categories table

  //     CREATE TABLE IF NOT EXISTS recipe_categories(
  //         categoryName VARCHAR(255) UNIQUE NOT NULL,
  //         description VARCHAR(1000)
  //     );

  //     -- Alter ingredients table to add foreign key constraints

  //     ALTER TABLE ingredients ADD CONSTRAINT recipe_measurements_fk FOREIGN KEY(measurement) REFERENCES recipe_measurements(unit),
  //     ADD CONSTRAINT recipe_fk FOREIGN KEY(recipeId) REFERENCES recipes(id);

  //     -- Alter recipe_steps table to add foreign key constraint

  //     ALTER TABLE recipe_steps ADD  CONSTRAINT recipe_fk FOREIGN KEY(recipeId) REFERENCES recipes(id);

  //     -- Alter recipes table to add foreign key constraints

  //     ALTER TABLE recipes ADD CONSTRAINT recipe_steps_fk FOREIGN KEY(recipeSteps) REFERENCES recipe_steps(stepId),
  //     ADD CONSTRAINT recipe_category_fk FOREIGN KEY(recipeCategory) REFERENCES recipe_categories(categoryName),
  //     ADD CONSTRAINT recipe_ingredients_fk FOREIGN KEY(ingredients) REFERENCES ingredients(id);

  // END;
  // $$;
  // `;

  const insertRecipeQuery = `
DO $$
-- Declare a variable to store the recipe ID
DECLARE 
    recipe_id UUID;
    recipe_steps UUID[];
    recipe_ingredient_names TEXT[];
BEGIN
    -- Generate a UUID for the recipe
    SELECT gen_random_uuid() INTO recipe_id;

    -- Insert ingredients
    INSERT INTO recipe_measurements(unit) VALUES($1) ON CONFLICT (unit) DO NOTHING;
    INSERT INTO ingredients(measurement, name, quantity, imageFile, recipeId) VALUES($1,$2, $3, $4,recipe_id); 
    
    -- Insert recipe steps
    INSERT INTO recipe_steps(step, stepDetails, imageFile,recipeId) VALUES($5, $6, $7,recipe_id); 

    -- Insert recipe category
    INSERT INTO recipe_categories(categoryName) VALUES($8) ON CONFLICT DO NOTHING;

    -- Insert recipe
    SELECT stepId FROM recipe_steps WHERE recipeId = recipe_id INTO recipe_steps;
    SELECT name FROM ingredients WHERE recipeId = recipe_id INTO recipe_ingredient_names;
    INSERT INTO recipes(id,recipeCategory,name, recipeImage, description, totalSteps,recipeSteps,ingredients) VALUES(recipe_id,$8,$9,$10,$11,$12,recipe_steps,recipe_ingredient_names) RETURNING *;

END;
$$ LANGUAGE plpgsql;
`;

  const stepOneQuery = `
  DO $$
-- Declare a variable to store the recipe ID
DECLARE 
    recipe_id UUID;
    recipe_steps UUID[];
    recipe_ingredient_names TEXT[];
BEGIN
    -- Generate a UUID for the recipe
    SELECT gen_random_uuid() INTO recipe_id;
    


`;
  const stepTwoQuery = `

`;
  await PostgresDBClient.init();
  //   await PostgresDBClient.query(createTablesQuery);
  const bindValues = getRequiredFormat(payload);
  console.log("bindValues", bindValues);
  //   const result = await PostgresDBClient.query(insertRecipeQuery, bindValues);

  await PostgresDBClient.query("BEGIN");
  await PostgresDBClient.query(stepOneQuery);
  //   await PostgresDBClient.query("SELECT gen_random_uuid() INTO recipe_id;");
  await PostgresDBClient.query(
    "INSERT INTO recipe_measurements(unit) VALUES($1) ON CONFLICT (unit) DO NOTHING;",
    bindValues.slice(0, 1)
  );
  const result = await PostgresDBClient.query(
    `INSERT INTO ingredients(measurement, name, quantity, imageFile, recipeId) VALUES($1,$2, $3, $4,recipe_id); `,
    bindValues.slice(0, 4)
  );
  await PostgresDBClient.query(`
  END;
    $$ LANGUAGE plpgsql;`);
  await PostgresDBClient.query("COMMIT");
  return result.rows;
}
