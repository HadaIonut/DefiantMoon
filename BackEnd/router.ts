import { Router } from "https://deno.land/x/oak@v11.1.0/router.ts";
import actorsRouter from "./api/actors/router.ts";
import { authRouter } from "./api/auth/router.ts";
import chatRouter from "./api/chat/router.ts";
import { usersRouter } from "./api/users/router.ts";
import { websocketServer } from "./api/websocket/index.ts";
import { authMiddleWare } from "./auth/index.ts";
import canvasRouter from "./api/canvas/router.ts";

export const apiRouter = new Router();

apiRouter.get("/api/", (context) => { context.response.body = { status: "active", version: "1.0.0" } })
apiRouter.use("/api/auth", authRouter.routes(), authRouter.allowedMethods());
apiRouter.use("/api/users", usersRouter.routes(), usersRouter.allowedMethods());
apiRouter.get("/api/websocket", authMiddleWare, websocketServer);
apiRouter.use("/api/chat", authMiddleWare, chatRouter.routes(), chatRouter.allowedMethods());
apiRouter.use("/api/actors", actorsRouter.routes(), actorsRouter.allowedMethods())
apiRouter.use("/api/canvas", authMiddleWare, canvasRouter.routes(), canvasRouter.allowedMethods())