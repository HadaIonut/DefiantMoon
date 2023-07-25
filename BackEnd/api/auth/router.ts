import { Router } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { createAccessToken } from "../../auth/index.ts";
import { getUserByUsername } from "../../database/repos/users.ts";
import { hashPassword } from "../../utils/hashing.ts";
import { thowBadRequest } from "../utils.ts";


export const authRouter = new Router();

authRouter.post("/login", async ({ request, response, cookies }) => {
    const { username, password } = await request.body().value;

    if (username === undefined || password === undefined) {
        return thowBadRequest(response, "MissingParams")
    }

    const user = await getUserByUsername(username);

    if (!user) {
        return thowBadRequest(response, "UserNotFound")
    }

    if (user.password !== hashPassword(password)) {
        return thowBadRequest(response, "WrongPassword")
    }

    const accessToken = await createAccessToken(user);

    cookies.set("accessToken", accessToken);
    response.body = {
        "accessToken": user._id
    }
    response.status = 200;
});