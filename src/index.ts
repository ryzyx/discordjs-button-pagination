import { MessageActionRow, MessageEmbed, MessageButton } from "discord.js";


export const paginationEmbed = async (interaction: any, pages: MessageEmbed[], buttonList: MessageButton[], timeout: number = 120000) => {
	if (!pages) throw new Error("Pages are not given.");
	if (!buttonList) throw new Error("Buttons are not given.");
	if (buttonList[0].style === "LINK" || buttonList[1].style === "LINK")
		throw new Error(
			"Link buttons are not supported with discordjs-button-pagination"
		);
	if (buttonList.length !== 2) throw new Error("Need two buttons.");

	let page = 0;

	const row = new MessageActionRow().addComponents(buttonList);

	//has the interaction already been deferred? If not, defer the reply.
	if (interaction.deferred == false) {
		await interaction.deferReply()
	};

	const curPage = await interaction.editReply({
		embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)],
		components: [row], fetchReply: true,
	});

	const filter = (i: { customId: any; }) =>
		i.customId === buttonList[0].customId ||
		i.customId === buttonList[1].customId;

	const collector = await curPage.createMessageComponentCollector({
		filter,
		time: timeout,
	});

	collector.on("collect", async (i: { customId: any; deferUpdate: () => any; editReply: (arg0: { embeds: any[]; components: any[]; }) => any; }) => {
		switch (i.customId) {
			case buttonList[0].customId:
				page = page > 0 ? --page : pages.length - 1;
				break;
			case buttonList[1].customId:
				page = page + 1 < pages.length ? ++page : 0;
				break;
			default:
				break;
		}
		await i.deferUpdate();
		await i.editReply({
			embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)],
			components: [row],
		});
		collector.resetTimer();
	});

	collector.on("end", () => {
		if (!curPage.deleted) {
			const disabledRow = new MessageActionRow().addComponents(
				buttonList[0].setDisabled(true),
				buttonList[1].setDisabled(true)
			);
			curPage.edit({
				embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)],
				components: [disabledRow],
			});
		}
	});

	return curPage;
};
