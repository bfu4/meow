import {TYPES} from "../cryptoConstants";

export type Crypto = typeof TYPES[number];

export function getCryptoFromString(crypto: string): Crypto | null {
  const formatted = crypto.toUpperCase().split(" ")[0].toUpperCase();
  return TYPES.find((name: Crypto) => name.toString() === formatted) || null;
}
