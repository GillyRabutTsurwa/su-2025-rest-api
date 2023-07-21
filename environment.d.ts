//IMPORTANTNOTE: how to use .env variables in Typescript
// https://stackoverflow.com/questions/45194598/using-process-env-in-typescript
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DEV_DATABASE_URL: string;
            PROD_DATABASE_URL: string;
            GITHUB_OCTOKIT_KEY: string;
            NODE_ENV: "development" | "production";
        }
    }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
