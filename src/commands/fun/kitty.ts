import {Command} from "../../types/command";
import {Message} from "discord.js";
import fetch from "node-fetch";
import {colors, reactions} from "../util/embedDecor";
import {EmbedBuilder} from "../util/embedBuilder";

const titles = ["meow!", "mew", "a wild kitty has appeared!", ".w."];

export const kitty: Command = {

  aliases: ["meow", "m"],
  description: "send a kitty :3",
  inhibitors: [],

  async run(message: Message) {
    const titleIndex = Math.floor(Math.random() * titles.length);
    const colorIndex = Math.floor(Math.random() * colors.length);
    const fetched = await fetch("https://aws.random.cat/meow");
    const res = await fetched.json();

    await new EmbedBuilder()
      .setTitle(titles[titleIndex])
      .setColor(colors[colorIndex])
      .setImage(await res.file)
      .setFooter("made with <3 by meow")
      .addReactions(...reactions)
      .sendTo(message.channel);
  }

};
