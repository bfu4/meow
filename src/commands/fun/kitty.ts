import {Command} from "../../types/command";
import {EmojiIdentifierResolvable, Message, MessageEmbed} from "discord.js";
import fetch from "node-fetch";

export const colors = [ "#fecde0", "#efeaa2", "#a2ebef", "#a2efcd" ]
export const reactions : EmojiIdentifierResolvable[] = [
  "🐱", "😼", "❤️", "💙",
  "💖", "✨"
]

const titles = [ "meow!", "mew", "a wild kitty has appeared!", ".w." ];

export const kitty : Command = {

  aliases: [ "meow", "m" ],
  description: "send a kitty :3",
  inhibitors: [],

  async run(message : Message) {
    const titleIndex = Math.floor(Math.random() * titles.length);
    const colorIndex = Math.floor(Math.random() * colors.length)
    const fetched = await fetch("https://aws.random.cat/meow");
    const res = await fetched.json();

    const embed = new MessageEmbed()
      .setTitle(titles[titleIndex])
      .setColor(colors[colorIndex])
      .setImage(await res.file)
      .setFooter("made with <3 by meow");

    await message.channel.send(embed);
  }

}
