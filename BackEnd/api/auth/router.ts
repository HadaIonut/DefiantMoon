import { Router } from "https://deno.land/x/oak@v11.1.0/router.ts";


export const authRouter = new Router();

authRouter.post("/", ({ request, response }) => {
    console.log(request);
});