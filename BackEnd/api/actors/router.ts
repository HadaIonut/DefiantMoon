import { Router } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { getActors } from "../../database/repos/actors.ts";

const actorsRouter = new Router();

actorsRouter.get("/all", async (context) => {
    const actors = await getActors();

    context.response.body = { actors };
});

export default actorsRouter;
