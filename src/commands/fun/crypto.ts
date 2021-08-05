import {Command} from "../../types/command";
import {Message} from "discord.js";
import fetch from "node-fetch";
import {getCryptoFromString, Crypto} from "../../types/crypto";
import {colors} from "../util/embedDecor";
import {EmbedBuilder} from "../util/embedBuilder";

export const cryptoCommand: Command = {
  dynamicAlias: "${ticker}",
  aliases: [],
  description: "get price of a given crypto currency ticker!",
  inhibitors: [],

  async run(message: Message) {
    const crypto = message.content.substring(1).toUpperCase();
    const found = getCryptoFromString(crypto);
    if (!found) {
      await new EmbedBuilder()
        .setTitle("error :<")
        .setColor(colors[0])
        .setDescription(`currency ${crypto} not found.`)
        .sendTo(message.channel);
      return;
    }
    const data = await geckoFetch(found);

    const colorIndex = Math.floor(Math.random() * colors.length);

    await new EmbedBuilder()
      .setTitle(`$${data.symbol}`)
      .addField({name: "USD: ", value: data.market_data.current_price.usd})
      .addField({name: "BTC:", value: data.market_data.current_price.btc})
      .setColor(colors[colorIndex])
      .setImage(data.image.thumb)
      .setFooter("made with <3 by meow")
      .sendTo(message.channel);
  },
};

async function geckoFetch(c: Crypto) {
  const identifier = await resolveId(c);
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/${identifier.id}?tickers=true&market_data=true`
  );
  return res.json();
}

async function resolveId(c: Crypto) {
  const res = await fetch(`https://api.coingecko.com/api/v3/coins/list`);
  const data = await res.json();
  return data.find((el: any) => el.symbol.toUpperCase() === c);
}
