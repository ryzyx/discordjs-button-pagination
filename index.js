const { MessageButton , MessageActionRow } = require('discord.js')
const paginationEmbed = async (msg, pages, buttonList , timeout = 120000) => {
	if (!msg && !msg.channel) throw new Error('Channel is inaccessible.');
	if (!pages) throw new Error('Pages are not given.');
    if(!buttonList) throw new Error('Buttons are not given.')
	if (buttonList.length !== 2) throw new Error('Need two buttons.');
	let page = 0;
    const row = new MessageActionRow()
    .addComponents(buttonList)
	const curPage = await msg.channel.send({ embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)] , components: [row]});
	const filter = i => i.customID === buttonList[0].customID || i.customID === buttonList[1].customID
	const collector = await curPage.createMessageComponentInteractionCollector(filter, { time: timeout});
	collector.on('collect', async i => {
		switch (i.customID) {
            case buttonList[0].customID:
                page = page > 0 ? --page : pages.length - 1;
                await i.deferUpdate();
                await i.editReply({ embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)], components: [row] });
                break;
            case buttonList[1].customID:
                page = page + 1 < pages.length ? ++page : 0;
                await i.deferUpdate();
                await i.editReply({ embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)], components: [row] });
                break;
            default:
                break;
        }
		
	});
	collector.on('end', () => {
		if (!curPage.deleted) {
			const disabledRow = [buttonList[0].setDisabled(true), buttonList[1].setDisabled(true)]
			curPage.edit({embeds:[pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)] , components: [disabledRow] })
		}
	});
	return curPage;
};
module.exports = paginationEmbed;
