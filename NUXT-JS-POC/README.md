## Nuxt JS POC

#### Setting up a PostgresQL database for the POC

1. Using docker
   `docker run -p 8080:5432 -d  --name nuxtjs-poc-postgres-db -e POSTGRES_PASSWORD=superSecretPassword -e POSTGRES_DB=nuxtJsPOCDb -e POSTGRES_USER=nuxtJsPOC postgres`
2. Create an `.env` file and put an environment variable `NUXT_POSTGRES_CONNECTION_STRING_URL` and assign the connection string value which is in our case if we are using the above method `postgresql://nuxtJsPOC:superSecretPassword@localhost:8080/nuxtJsPOCDb`

> **A connection string has the following format:** > `<protocol>://<username>:<password>@<host>:<port>/<database>`

#### SQL Queries

1. Create tables using the following SQL query:
   We will used the following tables:
   - `recipe_measurements`
   - `recipe_steps`
   - `recipes`
   - `ingredients`
   - `recipe_categories`

```sql

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
          name   VARCHAR(255) UNIQUE NOT NULL,
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
      ALTER TABLE ingredients ADD CONSTRAINT recipe_measurements_fk FOREIGN KEY(measurement) REFERENCES recipe_measurements(unit),
      ADD CONSTRAINT recipe_fk FOREIGN KEY(recipe_id) REFERENCES recipes(id);

      -- Alter recipe_steps table to add foreign key constraint
      ALTER TABLE recipe_steps DROP CONSTRAINT IF EXISTS recipe_fk;
      ALTER TABLE recipe_steps ADD  CONSTRAINT recipe_fk FOREIGN KEY(recipe_id) REFERENCES recipes(id);

      -- Alter recipes table to add foreign key constraints
      ALTER TABLE recipes DROP CONSTRAINT IF EXISTS recipe_category_fk;
      ALTER TABLE recipes ADD CONSTRAINT recipe_category_fk FOREIGN KEY(recipe_category) REFERENCES recipe_categories(category_name);

  END;
  $$;
```

2. SQL query to drop the tables:

```sql
DROP TABLE IF EXISTS recipe_measurements, recipe_steps, recipes, ingredients, recipe_categories;
```
