import { verify, create, getNumericDate, Payload, Header } from "https://deno.land/x/djwt@v2.7/mod.ts";
import { Context } from "https://deno.land/x/oak@v11.1.0/context.ts";
import { Middleware } from "https://deno.land/x/oak@v11.1.0/middleware.ts";
import { UserSchema } from "../database/schemas/user.ts";

const header: Header = {
    alg: "HS512",
    typ: "JWT",
};

const PAYLOAD: Payload = {
    iss: "DefiantMoon",
};

// const key = await crypto.subtle.generateKey(
//     { name: "HMAC", hash: "SHA-512" },
//     true,
//     ["sign", "verify"],
// );

// TODO: remove hardcoded key
const jwkEcKey = {
    "kty": "oct",
    "k": "OVQXk5WppWi-Kn00L4NrcGcRyLzUVyBljno3C1CqPTVAI13KWTaKhFAH86Vzmj6wvPqW44voloKmkDEU7nHJdkU_2yogLDY4N8A2_egt02Ahtz6QrBBUR2aMFW_kj_SKBX0zE6_6yk1IEpo4SUHFqM_WlcIpTUMQEwlp2JC0TzA",
    "alg": "HS512",
    "key_ops": ["sign", "verify"],
    "ext": true
};

const key = await crypto.subtle.importKey(
    "jwk",
    jwkEcKey,
    {
        name: "HMAC",
        hash: "SHA-512"
    },
    true,
    ["sign", "verify"]
);

export const createAccessToken = (user: UserSchema) => {
    const payload: Payload = {
        ...PAYLOAD,
        exp: getNumericDate(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
        userId: user._id,
    };
    return create(header, payload, key);
};

export const validateAccessToken = (accessToken: string) => {
    return verify(accessToken, key);
};

export const authMiddleWare: Middleware = async (context: Context, next: () => Promise<unknown>) => {

    const accessToken = await context.cookies.get("accessToken");
    console.log(accessToken)
    if (!accessToken) {
        context.response.status = 403;
        return
    }
    try {
        const payload = await validateAccessToken(accessToken);
        console.log(payload, context.state.userId)
        context.state.userId = payload.userId;
        await next();
        delete context.state.userId;
    } catch (_) {
        console.log(_)
        context.response.status = 401;
        return
    }
};

export const getCurrentUserId = (context: Context): string => {
    return context.state.userId;
}
