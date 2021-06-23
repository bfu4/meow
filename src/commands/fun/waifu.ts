import {Command} from "../../types/command";
import {Message} from "discord.js";
import fetch from "node-fetch";
import {EmbedBuilder} from "../util/embedBuilder";
import {colors, reactions} from "../util/embedDecor";

const titles = ["=^w^=!", "waifu", "uwu", ".w."];

export const waifu: Command = {
  aliases: ["waifu", "w"],
  description: "nekoo!",
  inhibitors: [],

  async run(message: Message) {
    const titleIndex = Math.floor(Math.random() * titles.length);
    const colorIndex = Math.floor(Math.random() * colors.length);
    const fetched = await fetch("https://waifu.pics/api/sfw/neko");
    const res = await fetched.json();

    await new EmbedBuilder()
      .setTitle(titles[titleIndex])
      .setColor(colors[colorIndex])
      .setImage(await res.url)
      .setFooter("made with <3 by meow")
      .addReactions(...reactions)
      .sendTo(message.channel);
  },
};
