import {MeowColor, MeowReaction} from "./embedDecor";
import {
  DMChannel,
  EmbedFieldData,
  EmojiResolvable,
  MessageEmbed,
  NewsChannel,
  TextChannel
} from "discord.js";

/**
 * Base for building embeds
 */
export class EmbedBuilder {

  title?: string;
  description?: string;
  url?: string;
  color: string;
  reactions?: EmojiResolvable[];
  image?: string;
  footer?: string;
  fields?: {name: any, value: any, inline?: boolean | undefined}[];

  constructor() {
    this.footer = "made with <3 by meow";
    this.color = "#36393F";
  }

  /**
   * Set the title
   * @param title
   */
  setTitle(title: string): EmbedBuilder {
    this.title = title;
    return this;
  }


  /**
   * Set the description
   * @param description
   */
  setDescription(description: string): EmbedBuilder {
    this.description = description;
    return this;
  }

  /**
   * Set the url
   * @param url
   */
  setUrl(url: string): EmbedBuilder {
    this.url = url;
    return this;
  }

  /**
   * Set the color of the embed
   * @param color
   */
  setColor(color: MeowColor): EmbedBuilder {
    this.color = color;
    return this;
  }

  /**
   * Add a reaction
   * @param reaction
   */
  addReaction(reaction: MeowReaction): EmbedBuilder {
    if (!this.reactions) this.reactions = [];
    this.reactions.push(reaction);
    return this;
  }

  addReactions(...reactions: MeowReaction[]): EmbedBuilder {
    reactions.forEach((reaction) => this.addReaction(reaction));
    return this;
  }

  /**
   * Add fields
   * @param fields
   */
  addFields(...fields: EmbedFieldData[]): EmbedBuilder {
    fields.forEach((field) => this.addField(field));
    return this;
  }

  /**
   * Add a field
   */
  // eslint-disable-next-line
  addField(field: EmbedFieldData): EmbedBuilder {
    if (!this.fields) this.fields = [];
    this.fields.push(field);
    return this;
  }

  /**
   * Set the image
   * @param image
   */
  setImage(image: string): EmbedBuilder {
    this.image = image;
    return this;
  }

  /**
   * Set the footer
   * @param text
   */
  setFooter(text: string): EmbedBuilder {
    this.footer = text;
    return this;
  }

  /**
   * Build the embed
   */
  build(): MessageEmbed {
    const embed = new MessageEmbed()
      .setFooter(this.footer)
      .setColor(this.color)
    if (this.title) embed.setTitle(this.title)
    if (this.description) embed.setDescription(this.description)
    if (this.url) embed.setURL(this.url);
    if (this.image) embed.setImage(this.image);
    if (this.fields) embed.addFields(...this.fields)
    return embed;
  }

  /**
   * Send embed to channel
   * @param channel
   */
  async sendTo(channel: TextChannel | DMChannel | NewsChannel): Promise<void> {
    const sendEmbed = await channel.send(this.build());
    // Send the reactions
    if (this.reactions) {
      for (const reaction of this.reactions) {
        await sendEmbed.react(reaction).catch(() => null);
      }
    }
  }

}