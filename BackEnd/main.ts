import { Application } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { apiRouter } from "./router.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

const app = new Application();

// TODO: Remove this insecure shit
app.use((ctx, next) => {
    ctx.response.headers.set('Access-Control-Allow-Origin', '*')
    return next()
})

//TODO: more shit to remove here
app.use(oakCors());
app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());


app.listen({ port: 8000 })
