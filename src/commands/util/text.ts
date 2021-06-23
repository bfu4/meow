import {Message, User} from "discord.js";

const MENTION_PREFIX = "<@!";

type MappedUser = {user: User; parsed: string};

export class Mentions {
  /**
   * Sanitize a message
   * @param message
   */
  public static sanitize(message: Message): string {
    const users = message.mentions.users;
    const mentions = this.parseMentions(message);
    const mapped = this.map(message.mentions.users.array(), mentions);
    let sanitized = message.content.substr(1);
    if (users.size < 1) {
      return sanitized;
    }

    mentions.forEach(id => {
      sanitized = this.sanitizeUser(sanitized, this.retrieveFromMap(id, mapped as MappedUser[])!);
    });
    return sanitized;
  }

  /**
   * Map users with parse ids
   * @param users
   * @param parsed
   * @private
   */
  private static map(users: User[], parsed: string[]): (MappedUser | undefined)[] {
    return parsed.map(value => {
      const user = users.find(u => {
        if (value === u.id) {
          return u;
        }
      });
      if (user !== undefined) return {user, parsed: value};
    });
  }

  private static retrieveFromMap(id: string, map: MappedUser[]): User | null {
    const mappedUser = map.find(k => k.parsed === id);
    if (!mappedUser) return null;
    return mappedUser.user;
  }

  /**
   * Parse the real number of mentions
   * @param message
   * @private
   */
  private static parseMentions(message: Message): string[] {
    const num = this.numberOfMentions(message);
    const split = message.content.split(MENTION_PREFIX);
    const users: string[] = [];
    if (num === 0) return users;
    for (let i = 1; i < num; i++) {
      const len = split[i].indexOf(">");
      users.push(split[i].substring(0, len));
    }
    return users;
  }

  /**
   * Get the real number of mentions
   * @param message
   * @private
   */
  private static numberOfMentions(message: Message): number {
    return message.content.split(MENTION_PREFIX).length;
  }

  /**
   * Sanitize the user
   * @param sanitizeString
   * @param user
   * @private
   */
  private static sanitizeUser(sanitizeString: string, user: User): string {
    if (this.isSanitizable(sanitizeString, user.toString())) {
      return sanitizeString.replace(
        `${MENTION_PREFIX}${user.toString().split("@")[1]}`,
        this.trimUsername(user)
      );
    }
    return sanitizeString;
  }

  /**
   * Trim the user name
   * @param user
   * @private
   */
  private static trimUsername(user: User) {
    return user.username
      .split("\u0020")
      .filter(c => c.trim().length)
      .join("\u0020");
  }

  /**
   * Whether the user string can be sanitized
   * @param sanitizerString
   * @param userString
   * @private
   */
  private static isSanitizable(sanitizerString: string, userString: string): boolean {
    const userStringSplit = userString.split("@");
    if (userStringSplit.length < 2) return false;
    return sanitizerString.indexOf(`${MENTION_PREFIX}${userStringSplit[1]}`) !== -1;
  }
}
