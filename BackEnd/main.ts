import staticFiles from "https://deno.land/x/static_files@1.1.6/mod.ts";
import { Application } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { apiRouter } from "./router.ts";

const app = new Application();

app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());
app.use(staticFiles("/cdn/images", { prefix: "/cdn/images" }))

console.log("deno running on: http://localhost:8000")
app.listen({ port: 8000 })
