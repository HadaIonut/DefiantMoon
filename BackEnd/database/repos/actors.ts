import { db } from "../connection.ts";
import { ActorSchema, ActorTransport } from "../schemas/Actors.ts";

const actorsCollection = db.collection<ActorSchema>("Actors");

export const saveActor = (actor: ActorTransport) => {
    actorsCollection.insertOne(actor);
};

// export const getActorPaginatedByName = async (name: string) => {
//     return (await actorsCollection.find({
//         name: {$lt: na}
//     }))
// }
