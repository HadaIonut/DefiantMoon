import { Application } from "https://deno.land/x/oak/mod.ts";
import { apiRouter } from "./router.ts";

const app = new Application();

app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());


app.listen({ port: 8000 })
