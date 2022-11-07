import { db } from "../connection.ts";
import { ItemSchema, ItemTransport } from "../schemas/Items.ts";

const itemCollection = db.collection<ItemSchema>("Items");

export const saveItem = (item: ItemTransport) => {
    itemCollection.insertOne(item)
};
