import {Command} from "../../types/command";
import {Message, MessageEmbed} from "discord.js";
import fetch from "node-fetch";
import {getCryptoFromString} from "../../types/crypto";
import {colors} from "../util/embedDecor";

export const cryptoCommand: Command = {

  dynamicAlias: "${ticker}",
  aliases: [],
  description: "get price of a given crypto currency ticker!",
  inhibitors: [],

  async run(message: Message) {

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const crypto: Crypto = getCryptoFromString(message.content.substring(1).toUpperCase());
    const data = await geckoFetch(crypto);

    const colorIndex = Math.floor(Math.random() * colors.length);

    const embed = new MessageEmbed()
      .setTitle(`$${data.symbol}`)
      .addField("USD: ", data.market_data.current_price.usd)
      .addField("BTC:", data.market_data.current_price.btc)
      .setColor(colors[colorIndex])
      .setImage(data.image.thumb)
      .setFooter("made with <3 by meow");

    await message.channel.send(embed);
  }

};

async function geckoFetch(c: Crypto) {
  const identifier = await resolveId(c);
  const res = await fetch(`https://api.coingecko.com/api/v3/coins/${identifier.id}?tickers=true&market_data=true`);
  return res.json();
}

async function resolveId(c: Crypto) {
  const res = await fetch(`https://api.coingecko.com/api/v3/coins/list`);
  const data = await res.json();
  return data.find((el: any) => el.symbol.toUpperCase() === c);
}

