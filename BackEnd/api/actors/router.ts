import { Context } from "https://deno.land/x/oak@v11.1.0/context.ts";
import { Router } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { getActorPaginatedByName } from "../../database/repos/actors.ts";

const actorsRouter = new Router();

actorsRouter.get("/actors", async (context) => {
    const name = context.request.url.searchParams.get("name") || "";

    const actors = await getActorPaginatedByName(name);

    context.response.body = { actors };
})

export default actorsRouter;