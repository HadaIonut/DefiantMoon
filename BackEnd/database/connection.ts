import {
    MongoClient,
} from "https://deno.land/x/mongo@v0.31.1/mod.ts";
// import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";

// console.log(config());


const client = new MongoClient();

await client.connect("mongodb://admin:admin@mongodb:27017");

export const db = client.database("MyTestDb");
