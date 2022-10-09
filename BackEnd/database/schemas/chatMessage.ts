import { ObjectId, Timestamp } from "https://deno.land/x/mongo@v0.31.1/mod.ts";

type Roll = {
    original: string;
    result: string
}

export type ChatMessageSchema = {
    _id: ObjectId;
    from: ObjectId;
    content: (string | Roll)[];
    images: string[];
    timestamp: Timestamp;
};
