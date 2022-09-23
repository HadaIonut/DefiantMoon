import { Router } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { authRouter } from "./api/auth/router.ts";
import { usersRouter } from "./api/users/router.ts";

export const apiRouter = new Router();

apiRouter.get("/", (context) => { context.response.body = { status: "active", version: "1.0.0"} })
apiRouter.use("/auth", authRouter.routes(), authRouter.allowedMethods());
apiRouter.use("/users", usersRouter.routes(), usersRouter.allowedMethods());
