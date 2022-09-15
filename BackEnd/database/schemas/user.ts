import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";

export type UserSchema = {
	_id: ObjectId;
	username: string;
	password: string;
};
