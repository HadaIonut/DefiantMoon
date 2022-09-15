import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { hashPassword } from "../../utils/hashing.ts";
import { db } from "../connection.ts";
import { UserSchema } from "../schemas/user.ts";

const usersCollection = db.collection<UserSchema>("users");

export const getUserByUsername = (username: string) => {
	return usersCollection.findOne({
		username: username,
	});
};

export const createUser = (username: string, password: string) => {
	return usersCollection.insertOne({
		username: username,
		password: hashPassword(password),
	});
};

export const deleteUser = (userId: ObjectId) => {
	return usersCollection.deleteOne({
		_id: userId,
	});
};
