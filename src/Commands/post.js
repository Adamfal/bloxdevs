import { EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, ButtonBuilder, ButtonStyle, } from "discord.js";
import button from "./postHandlers/button.js";
import selectMenu from "./postHandlers/selectmenu.js";
import modal from "./postHandlers/modal.js";
import config from "../../config.json" assert { type: "json" };
export default {
    name: "post",
    description: "Post something for sale",
    async execute(interaction) {
        if (interaction.channelId != config.postChannel)
            return interaction.reply({
                ephemeral: true,
                content: `This command can only be used in <#${config.postChannel}>`,
            });
        const reply = new EmbedBuilder();
        reply.setTitle("Use the menu below to select the post type");
        const row = new ActionRowBuilder().addComponents([
            new SelectMenuBuilder()
                .setCustomId("post")
                .setPlaceholder("Please Select One")
                .addOptions([
                {
                    label: "For Hire",
                    value: "fhire",
                },
                {
                    label: "Looking to Hire",
                    value: "thire",
                },
            ]),
        ]);
        const row1 = new ActionRowBuilder().addComponents([
            new ButtonBuilder()
                .setCustomId("post|cancel")
                .setLabel("Cancel")
                .setStyle(ButtonStyle.Danger),
        ]);
        interaction.reply({ embeds: [reply], components: [row, row1] });
    },
    button,
    selectMenu,
    modal,
};
