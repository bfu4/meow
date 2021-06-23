import {Command} from "../types/command";

import {kitty} from "./fun/kitty";
import {makeCat} from "./fun/make-cat";
import {foaas} from "./fun/foaas";
import {cryptoCommand} from "./fun/crypto";
import {waifu} from "./fun/waifu";
import {tls} from "./fun/tls";
import {ratio} from "./fun/ratio";

/**
 * An array of all commands available for the bot.
 * To register a command, all you have to do is place it in this array
 */
export const commands: Command[] = [kitty, makeCat, foaas, cryptoCommand, waifu, tls, ratio];

const commandsWithAliases = commands.reduce((all, command) => {
  // Dedupe aliases
  const aliases = [...new Set(command.aliases)];

  return aliases.reduce((previous, commandName) => {
    return {...previous, [commandName]: command};
  }, all);
}, {} as Record<string, Command>);

export const aliases = new Map<string, Command>(Object.entries(commandsWithAliases));

const allCommandAliases = commands.map(c => c.aliases).flat();

const duplicateAliases = allCommandAliases.filter((c, i, a) => a.indexOf(c) !== i);

if (duplicateAliases.length > 0) {
  throw new Error(`Encountered duplicate aliases: ${duplicateAliases.join(", ")}`);
}
