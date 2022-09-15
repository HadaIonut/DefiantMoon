import { Router } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { authRouter } from "./api/auth/router.ts";

export const apiRouter = new Router();

apiRouter.use("/auth", authRouter.routes(), authRouter.allowedMethods());
