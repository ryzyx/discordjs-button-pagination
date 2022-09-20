const {
  ActionRowBuilder,
  Message,
  EmbedBuilder,
  ButtonBuilder,
} = require("discord.js");

/**
 * Creates a pagination embed
 * @param {Message} msg
 * @param {EmbedBuilder[]} pages
 * @param {ButtonBuilder[]} buttonList
 * @param {number} timeout
 * @returns
 */
const paginationEmbed = async (
  msg,
  pages,
  buttonList,
  timeout = 120000
) => {
  if (!msg && !msg.channel) throw new Error("Channel is inaccessible.");
  if (!pages) throw new Error("Pages are not given.");
  if (!buttonList) throw new Error("Buttons are not given.");
  if (buttonList[0].style === "LINK" || buttonList[1].style === "LINK")
    throw new Error(
      "Link buttons are not supported with discordjs-button-pagination"
    );
  if (buttonList.length !== 2) throw new Error("Need two buttons.");

  let page = 0;

  if (pages.length === 1) return await msg.channel.send({
    embeds: [pages[0].setFooter({ text: `Page ${page + 1} / ${pages.length}` })]
  });

  const row = new ActionRowBuilder().addComponents(buttonList);

  const curPage = await msg.channel.send({
    embeds: [pages[page].setFooter({ text: `Page ${page + 1} / ${pages.length}` })],
    components: [row]
  });

  const filter = (i) =>
    i.custom_id === buttonList[0].custo_id ||
    i.custom_id === buttonList[1].custom_id;

  const collector = await curPage.createMessageComponentCollector({
    filter,
    time: timeout,
  });

  collector.on("collect", async (i) => {
    switch (i.customId) {
      case buttonList[0].data.custom_id:
        page = page > 0 ? --page : pages.length - 1;
        break;
      case buttonList[1].data.custom_id:
        page = page + 1 < pages.length ? ++page : 0;
        break;
      default:
        break;
    }
    await i.deferUpdate();
    await i.editReply({
      embeds: [pages[page].setFooter({ text: `Page ${page + 1} / ${pages.length}` })],
      components: [row],
    });
    collector.resetTimer();
  });

  collector.on("end", () => {
    if (curPage.editable) {
      const disabledRow = new ActionRowBuilder().addComponents(
        buttonList[0].setDisabled(true),
        buttonList[1].setDisabled(true)
      );
      curPage.edit({
        embeds: [pages[page].setFooter({ text: `Page ${page + 1} / ${pages.length}` })],
        components: [disabledRow],
      });
  }
});

  return curPage;
};
module.exports = paginationEmbed;
