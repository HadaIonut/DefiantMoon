import { Router } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { authRouter } from "./api/auth/router.ts";
import { usersRouter } from "./api/users/router.ts";
import { websocketServer } from "./api/websocket/index.ts";

export const apiRouter = new Router();

apiRouter.get("/api/", (context) => { context.response.body = { status: "active", version: "1.0.0" } })
apiRouter.use("/api/auth", authRouter.routes(), authRouter.allowedMethods());
apiRouter.use("/api/users", usersRouter.routes(), usersRouter.allowedMethods());
apiRouter.get("/api/websocket", websocketServer);