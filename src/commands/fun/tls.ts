import {Command} from "../../types/command";
import {Message} from "discord.js";
import {colors, reactions} from "../util/embedDecor";
import {EmbedBuilder} from "../util/embedBuilder";

const images = [
  {name: "Asymmetric Keys.", key: "asymmetric", fileName: "asymmetric.gif"},
  {name: "Three Way TCP Handshake", key: "handshake", fileName: "handshake.gif"},
  {name: "JA3", key: "ja3", fileName: "ja3.gif"},
  {name: "Cipher Suite Not Supported", key: "suite", fileName: "notsupported.gif"},
  {name: "Public Client Session Key", key: "publickey", fileName: "publickey.gif"},
  {name: "Require TLS", key: "requiretls", fileName: "requiretls.gif"},
  {name: "Transport Layer Security", key: "tls", fileName: "tls.gif"},
];

export const tls: Command = {
  aliases: ["tls", "t"],
  description: "tls memes.",
  inhibitors: [],

  async run(message: Message) {
    const colorIndex = Math.floor(Math.random() * colors.length);
    const args = message.content.split("\u0020");
    const embed = new EmbedBuilder().setColor(colors[colorIndex]);
    let file;

    if (args.length < 2) {
      file = images[Math.floor(Math.random() * images.length)];
    } else if (args[1] === "keys" || args[1] === "help") {
      const fields = images.map(image => {
        return {name: image.name, value: `key: ${image.key}`, inline: false};
      });
      await embed
        .setTitle("tls index")
        .addFields(...fields)
        .sendTo(message.channel);
      return;
    } else {
      file = images[images.findIndex(value => value.key === args[1])];
    }

    if (file === undefined) {
      await embed.setTitle("Invalid key!").sendTo(message.channel);
      return;
    }

    await embed
      .setTitle(file.name)
      .setImage(`https://tls.localhost22.com/${file.fileName}`)
      .setFooter("made with <3 by meow")
      .addReactions(...reactions)
      .sendTo(message.channel);
  },
};
