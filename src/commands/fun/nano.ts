import {Command} from "../../types/command";
import {Message, MessageEmbed} from "discord.js";
import {colors} from "./kitty";
import {convert} from "current-currency";

export const nano : Command = {

  aliases: [ "nano", "n" ],
  description: "send a kitty :3",
  inhibitors: [],

  async run(message : Message) {
    const colorIndex = Math.floor(Math.random() * colors.length)
    const dat = await fetch(`https://api.coinbase.com/v2/exchange-rates?currency=NANO`);
    const price = await dat.json();

    const embed = new MessageEmbed()
      .setTitle("$nano")
      .addField("USD: ", price.data.rates.USD)
      .addField("BTC:", price.data.rates.BTC)
      .setColor(colors[colorIndex])
      .setImage("https://nano.org/apple-touch-icon.png")
      .setFooter("made with <3 by meow");

    await message.channel.send(embed);
  }

}
