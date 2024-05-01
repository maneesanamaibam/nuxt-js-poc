import { PostgresDBClient } from "~/server/queries/db";

export default defineEventHandler(async (event) => {
  try {
    const { unit } = await readBody(event);
    const onlyAlphabetsRegex = /^[a-zA-Z]+$/;
    let errMsg = "";
    if (!unit) {
      errMsg = "Invalid payload. 'unit' field missing.";
      setResponseStatus(event, 400, errMsg);
      return {
        status: "error",
        message: errMsg,
      };
    } else if (!onlyAlphabetsRegex.test(unit)) {
      errMsg = "Invalid payload. 'unit' should be a string.";
      setResponseStatus(event, 400, errMsg);
      return {
        status: "error",
        message: errMsg,
      };
    }

    PostgresDBClient.init();
    await PostgresDBClient.query(
      `INSERT INTO recipe_measurements VALUES($1);`,
      [unit]
    );
    return {
      status: "success",
      message: "You have successfully added a recipe measurement unit.",
    };
  } catch (err: Error | unknown) {
    const errMsg = err instanceof Error ? err.message : JSON.stringify(err);
    setResponseStatus(event, 405, errMsg);
    return {
      status: "error",
      message: errMsg,
    };
  }
});
