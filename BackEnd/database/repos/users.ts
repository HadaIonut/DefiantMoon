import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { hashPassword } from "../../utils/hashing.ts";
import { db } from "../connection.ts";
import { UserSchema } from "../schemas/user.ts";

const usersCollection = db.collection<UserSchema>("users");

export const getUsersForWorld = (worldId: string) => {
	return usersCollection.find({});
}

export const getUserByUsername = (username: string) => {
	return usersCollection.findOne({
		username: username,
	});
};

export const getUserById = (userId: string) => {
	return usersCollection.findOne({
		_id: new ObjectId(userId),
	});
};

export const createUser = ({ username, password }: { username: string, password: string }) => {
	const user = {
		username: username,
		password: hashPassword(password),
	};
	return new Promise<UserSchema>((resolve, reject) => {
		usersCollection.insertOne(user)
			.then((userId) => resolve({ ...user, _id: userId }))
			.catch(reject)
	});
};

export const deleteUser = (userId: ObjectId) => {
	return usersCollection.deleteOne({
		_id: userId,
	});
};
