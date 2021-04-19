import { TYPES } from "../cryptoConstants";

export type Crypto = typeof TYPES[number];

export function getCryptoFromString(crypto: string) : Crypto {
  return TYPES.find((name) => name === crypto.split(" ")[0].toUpperCase()) || "";
}
