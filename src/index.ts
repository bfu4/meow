import "dotenv/config";

import {Client, EmbedField} from "discord.js";
import {aliases, commands} from "./commands";
import {StandardEmbed} from "./structs/standard-embed";
import {isDev} from "./constants";
import signale from "signale";
import {getCryptoFromString} from "./types/crypto";
import {cryptoCommand} from "./commands/fun/crypto";

if (process.env.DISCORD_TOKEN) {
  const client = new Client();
  const prefix = process.env.PREFIX || "^";

  void client.login(process.env.DISCORD_TOKEN);

  client.on("ready", async () => {
    signale.info("Environment:", isDev ? "dev" : "prod");
    signale.success("Ready as", client.user?.tag);
  });

  client.on("message", async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    if (
      message.content.startsWith(prefix) &&
      message.content.substr(prefix.length).charAt(0) == " "
    ) {
      return;
    } else {
      const [rawCommandName, ...args] = message.content.replace(prefix, "").split(" ");
      const commandName = rawCommandName.toLowerCase();

      if (commandName === "help" && args[0]) {
        const command = aliases.get(args[0]);

        if (!command) {
          return message.reply("⚠ Unknown Command");
        }

        const embed = new StandardEmbed(message.author)
          .addField("Description", command.description)
          .addField("Aliases", command.aliases.map(a => `\`${a}\``).join(", "));

        if (command.syntax) {
          embed.addField("Syntax", `\`${prefix}${args[0]} ${command.syntax}\``);
        }

        return message.reply(embed);
      }

      if (commandName === "help") {
        const fields: EmbedField[] = commands.map(command => {
          const name = command.aliases[0];
          return {
            name: prefix + (name ? name : command.dynamicAlias ? command.dynamicAlias : ""),
            value: command.description,
            inline: false,
          };
        });

        const embed = new StandardEmbed(message.author).addFields(fields);

        return message.reply(embed);
      }

      const command = aliases.get(commandName);

      if (!command) {
        const crypto = getCryptoFromString(commandName);
        if (!crypto || crypto.length === 0) {
          return message.reply("⚠ Unknown Command");
        } else {
          await cryptoCommand.run(message, args);
          return;
        }
      }

      const inhibitors = Array.isArray(command.inhibitors)
        ? command.inhibitors
        : [command.inhibitors];

      try {
        for (const inhibitor of inhibitors) {
          await inhibitor(message, args);
        }

        await command.run(message, args);
      } catch (e) {
        await message.reply(`⚠ ${e.message}`);
      }
    }
  });
} else {
  signale.error("Missing discord bot token, cannot log in!");
}
