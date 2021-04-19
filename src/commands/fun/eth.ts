import {Command} from "../../types/command";
import {Message, MessageEmbed} from "discord.js";
import {colors} from "./kitty";
import {convert} from "current-currency";

export const eth : Command = {

  aliases: [ "eth", "e", "sex" ],
  description: "eth price",
  inhibitors: [],

  async run(message : Message) {
    const colorIndex = Math.floor(Math.random() * colors.length)
    const priceUSD = await convert("ETH",1,  "USD");
    const priceBTC = await convert("ETH", 1, "BTC");

    const embed = new MessageEmbed()
      .setTitle("$eth")
      .addField("USD: ", priceUSD.amount)
      .addField("BTC:", priceBTC.amount)
      .setColor(colors[colorIndex])
      .setImage("https://ethereum.org/static/a110735dade3f354a46fc2446cd52476/0ee04/eth-home-icon.png")
      .setFooter("made with <3 by meow");

    await message.channel.send(embed);
  }

}
