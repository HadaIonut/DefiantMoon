import { Sha512 } from "https://deno.land/std@0.156.0/hash/sha512.ts"


export const hashPassword = (password: string) => {
    return new Sha512().update(password).hex();
}
