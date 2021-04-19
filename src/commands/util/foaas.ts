import {Command} from "../../types/command";
import {Message, MessageEmbed} from "discord.js";
import fetch from "node-fetch";
import {colors, reactions} from "../fun/kitty";

export const foaas : Command = {

  aliases: [ "foaas", "fo" ],
  description: "foaas.com",
  inhibitors: [],

  async run(message : Message) {
    const colorIndex = Math.floor(Math.random() * colors.length)
    const embed = new MessageEmbed().setColor(colors[colorIndex]).setFooter("made with <3 by meow");

    let replmsg = message.content.substr(1);

    message.mentions.users.array().forEach((usr) => {
      if (replmsg.indexOf("<@!" + usr.toString().split("@")[1]) !== -1) {
        const rmm = usr.username.split(' ').filter(c => c.trim().length).join(" ");
        replmsg = replmsg.replace("<@!" + usr.toString().split("@")[1], rmm)
      }
    });

    replmsg = replmsg.startsWith(this.aliases[0]) ? replmsg.split(this.aliases[0])[1] : replmsg.split(this.aliases[1])[1];

    if (replmsg.length < 1 || replmsg.startsWith("help")) {
      embed
        .setTitle("foaas help")
        .setDescription("literally foaas.. you can click the title to find out more")
        .setURL("https://foaas.com")
        .setImage("https://geekologie.com/2016/02/17/angry-cat-5.jpg")
      await message.channel.send(embed);
      return;
    }

    const args = replmsg.split(" ");

    const fetched = await fetch(`https://foaas.com/${args[1]}` + "/" + (args[2] ? args[2] : "") + "/" + (args[3] ? args[3] : ""), {
      headers: {
        'Accept': 'application/json'
      }
    });


    if (fetched.status === 622) {
      embed
        .setTitle("fucks sake")
        .setDescription("couldn't you give a valid request? wtf is: \"" + replmsg.trim() + "\"")
        .setFooter("https://foaas.com <3 with meow")
        .setImage("https://geekologie.com/2016/02/17/angry-cat-5.jpg");
      const msg = await message.channel.send(embed);
      msg.react("😾").catch(() => null);
      return;
    }

    const res = await fetched.json();

    embed
      .setTitle(res.message)
      .setDescription(res.subtitle)
      .setImage("https://geekologie.com/2016/02/17/angry-cat-5.jpg")

    const msg = await message.channel.send(embed);
    reactions.forEach((reaction) => msg.react(reaction).catch(() => null));
  }

}
