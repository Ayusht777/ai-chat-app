import { Schema, model } from "mongoose";

const chatSchema = new Schema(
  {
    role: {
      type: String,
      required: true,
      index: true,
      enum: ["user", "assistant"],
    },
    content: {
      type: String,
      required: true,
      text: true,
    }, //text true if you want text base searches
  },
  { timestamps: true }
);

export const ChatMessage = model("ChatMessage", chatSchema);
