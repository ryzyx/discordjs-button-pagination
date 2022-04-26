export = paginationEmbed;
/**
 * Creates a pagination embed
 * @param {Interaction} interaction
 * @param {MessageEmbed[]} pages
 * @param {MessageButton[]} buttonList
 * @param {number} timeout
 * @returns
 */
declare function paginationEmbed(interaction: any, pages: MessageEmbed[], buttonList: MessageButton[], timeout?: number): Promise<any>;
import { MessageEmbed } from "discord.js";
import { MessageButton } from "discord.js";
