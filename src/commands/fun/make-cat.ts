import {Command} from "../../types/command";
import {Message, MessageEmbed} from "discord.js";
import fetch from "node-fetch";
import {colors, reactions} from "./kitty";

export const makeCat : Command = {

  aliases: [ "mc", "kitty" ],
  description: "make someone a cat!",
  inhibitors: [],

  async run(message : Message) {

    const server = message.guild;

    if (!server) {
      await message.reply("you are not in a server!");
      return;
    }

    const user = message.mentions.users.array()[0];
    if (!user) {
      await message.reply("unknown user" + user[0] + " :(")
      return;
    }

    let role = server.roles.cache.find(({name}) => name === "cat");

    const colorIndex = Math.floor(Math.random() * colors.length)

    if (!role) {
      role = await server.roles.create({
        data:
          {name: "cat", color: colors[colorIndex], mentionable: true}
      });
    }

    const gu = server.member(user);

    if (!gu) {
      await message.reply("unknown user" + gu + " :(")
      return;
    }

    const embed = new MessageEmbed()
      .setColor(colors[colorIndex]);

    if (gu.roles.cache.find(({name}) => name === "cat")) {
      embed
        .addField(user.username, "is already a cat!")
        .setImage(user.avatarURL({size: 2048}) || "default")
        .setFooter("meoww!!!")
    } else {
      embed
        .addField(user.username, "has been made a cat!")
        .setImage(user.avatarURL({size: 2048}) || "default")
        .setFooter("uuuuuuuuuuueeeee");

      await gu.roles.add(role);

      const canHaveNick = ((gu.nickname !== null ? gu.nickname : gu.displayName) + "\\s(cat)").length <= 32;
      if (canHaveNick && gu.displayName.indexOf("(cat)") === -1) await gu.setNickname("💖" + gu.displayName + " (cat)");

    }

    const msg = await message.channel.send(embed);
    reactions.forEach((reaction) => msg.react(reaction));
  }

}
