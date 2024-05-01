import { PostgresDBClient } from "./db";
export const createDBTables = async (): Promise<void> => {
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
            category_name VARCHAR(255) UNIQUE PRIMARY KEY NOT NULL,
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

  const authJsCreateTablesQuery = `
    CREATE TABLE IF NOT EXISTS verification_token (
      identifier TEXT NOT NULL,
      expires TIMESTAMPTZ NOT NULL,
      token TEXT NOT NULL,
     
      PRIMARY KEY (identifier, token)
    );
     
    CREATE TABLE IF NOT EXISTS accounts (
      id SERIAL,
      "userId" INTEGER NOT NULL,
      type VARCHAR(255) NOT NULL,
      provider VARCHAR(255) NOT NULL,
      "providerAccountId" VARCHAR(255) NOT NULL,
      account_identifier UUID UNIQUE DEFAULT gen_random_uuid(),
      refresh_token TEXT,
      access_token TEXT,
      expires_at BIGINT,
      id_token TEXT,
      scope TEXT,
      session_state TEXT,
      token_type TEXT,
     
      PRIMARY KEY (id)
    );
     
    CREATE TABLE IF NOT EXISTS sessions (
      id SERIAL,
      "userId" INTEGER NOT NULL,
      expires TIMESTAMPTZ NOT NULL,
      "sessionToken" VARCHAR(255) NOT NULL,
     
      PRIMARY KEY (id)
    );
     
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL,
      name VARCHAR(255),
      email VARCHAR(255),
      "emailVerified" TIMESTAMPTZ,
      image TEXT,
     user_identifier UUID UNIQUE DEFAULT gen_random_uuid(),
      PRIMARY KEY (id)
    );
    
    
    `;
  try {
    await PostgresDBClient.init();
    await PostgresDBClient.query(createTablesQuery);
    await PostgresDBClient.query(authJsCreateTablesQuery);
    // eslint-disable-next-line no-console
    console.log("Tables created successfully");
  } catch (err) {
    console.error("Error creating tables", err);
  } finally {
    PostgresDBClient.releaseClient();
  }
};
