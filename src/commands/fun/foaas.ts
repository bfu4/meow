import {Command} from "../../types/command";
import {Message} from "discord.js";
import fetch from "node-fetch";
import {EmbedBuilder} from "../util/embedBuilder";
import {colors, reactions} from "../util/embedDecor";
import {Mentions} from "../util/text";

export const foaas: Command = {

  aliases: ["foaas", "fo"],
  description: "foaas.com",
  inhibitors: [],

  async run(message: Message) {
    const colorIndex = Math.floor(Math.random() * colors.length);
    const embed = new EmbedBuilder();

    let sanitized = Mentions.sanitize(message);

    sanitized = sanitized.startsWith(this.aliases[0]) ? sanitized.split(this.aliases[0])[1] : sanitized.split(this.aliases[1])[1];

    if (sanitized.length < 1 || sanitized.startsWith("help")) {
      embed
        .setTitle("foaas help")
        .setDescription("literally foaas.. you can click the title to find out more")
        .setUrl("https://foaas.com")
        .setImage("https://geekologie.com/2016/02/17/angry-cat-5.jpg");
      await embed.sendTo(message.channel);
      return;
    }

    const args = sanitized.split("\u0020");

    const fetched = await fetch(`https://foaas.com/${args[1]}` + "/" + (args[2] ? args[2] : "") + "/" + (args[3] ? args[3] : ""), {
      headers: {
        "Accept": "application/json"
      }
    });


    if (fetched.status === 622) {
      await embed
        .setTitle("fucks sake")
        .setColor(colors[colorIndex])
        .setDescription("couldn't you give a valid request? wtf is: \"" + sanitized.trim() + "\"")
        .setFooter("https://foaas.com <3 with meow")
        .setImage("https://geekologie.com/2016/02/17/angry-cat-5.jpg")
        .addReaction("😾")
        .sendTo(message.channel);
      return;
    }

    const res = await fetched.json();

    await embed
      .setTitle(res.message)
      .setDescription(res.subtitle)
      .setImage("https://geekologie.com/2016/02/17/angry-cat-5.jpg")
      .addReactions(...reactions)
      .sendTo(message.channel);
  }

};
