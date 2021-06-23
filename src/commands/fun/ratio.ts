import {Command} from "../../types/command";
import {Message} from "discord.js";

export const ratio: Command = {
  aliases: ["ratio", "r"],
  description: "retweet",
  inhibitors: [],

  async run(message: Message) {
    const messageId = message.reference?.messageID;
    if (!messageId) {
      return;
    }
    const found = await message.channel.messages.fetch(messageId);
    await found.react("❤️");
    await found.react("<:retweet:857096066620981268>");
    await found.react("🗨️");
  },
};
