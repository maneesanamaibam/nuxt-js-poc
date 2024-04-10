### Nuxt JS POC

### Connection with PostgresQL

1. Using docker
   `docker run -p 8080:5432 -d  --name nuxtjs-poc-postgres-db -e POSTGRES_PASSWORD=superSecretPassword -e POSTGRES_DB=nuxtJsPOCDb -e POSTGRES_USER=nuxtJsPOC postgres`

### SQL Queries

1. Creation of Recipe table

```sql
CREATE TABLE recipe (
recipeId UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
recipeName VARCHAR(255) NOT NULL,
createdAt DATE NOT NULL DEFAULT CURRENT_DATE
);
```
