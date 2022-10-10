import { ObjectId, Timestamp } from "https://deno.land/x/web_bson@v0.2.5/mod.ts";
import { db } from "../connection.ts";
import { ChatMessageSchema } from "../schemas/chatMessage.ts";

const CHAT_MESSAGES_BLOCK_SIZE = 20;


const chatMessagesCollection = db.collection<ChatMessageSchema>("ChatMessage");

export const saveChatMessage = (content: ChatMessageSchema["content"], images: ChatMessageSchema["images"], from: ObjectId) => {
    chatMessagesCollection.insertOne({
        content,
        images,
        from: from,
        timestamp: Date.now(),
    })
};

export const getChatMessages = async (timestamp: number = Date.now()) => {
    console.log(timestamp)
    return (await chatMessagesCollection.find({
        timestamp: { $lt: timestamp }
    }).sort({
        timestamp: -1
    }).limit(CHAT_MESSAGES_BLOCK_SIZE).toArray()).reverse()
}