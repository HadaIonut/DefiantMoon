import { Request } from "https://deno.land/x/oak@v11.1.0/request.ts";
import { Response } from "https://deno.land/x/oak@v11.1.0/response.ts";


export const parseRequest = async (request: Request, keys: string[]) => {
    const params = await request.body().value;

    keys.forEach((key) => {
        if (!Object.keys(params).includes(key)) {
            throw Error;
        }
    })

    return params;
}

export const thowBadRequest = (response: Response, error: string) => {
    response.body = {
        error: error,
    }
    response.status = 400;
}