import { db } from "../connection.ts";
import { Actor, ActorSchema, ActorTransport } from "../schemas/Actors.ts";

const actorsCollection = db.collection<ActorSchema>("Actors");

export const saveActor = (actor: ActorTransport) => {
    actorsCollection.insertOne(actor);
};

const actorsMapper = (actor: ActorSchema) => {
    return {
        ...actor,
        id: actor._id.toString(),
        _id: undefined,
    };
};

export const getActors = async () => (await actorsCollection.find().sort({ name: 1 }).toArray()).map(actorsMapper);
