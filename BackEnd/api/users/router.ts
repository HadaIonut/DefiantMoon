import { Router } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { authMiddleWare } from "../../auth/index.ts";
import { createUser, getUserById, getUsersForWorld } from "../../database/repos/users.ts";
import { UserSchema } from "../../database/schemas/user.ts";
import { thowBadRequest } from "../utils.ts";

export const usersRouter = new Router();

const mapAvailableUser = (user: UserSchema) => ({
    ...user,
    _id: undefined,
    password: undefined,
    id: user._id,
});

usersRouter.get("/", async ({ response }) => {
    response.body = {
        users: await getUsersForWorld("").map(mapAvailableUser),
    }
    response.status = 200;
});

usersRouter.post("/", async ({ request, response }) => {
    const { username, password } = await request.body().value;

    if (username === undefined || password === undefined) {
        return thowBadRequest(response, "MissingParams");
    }

    const user = await createUser({
        username: username,
        password: password
    });

    response.body = {
        user: mapAvailableUser(user),
    }
    response.status = 200;
});

usersRouter.get("/me", authMiddleWare, async ({ response, state }) => {
    const user = await getUserById(state.userId);
    if (!user) {
        return thowBadRequest(response, "UserNotFound");
    }
    response.body = { user: mapAvailableUser(user) };
});