import { ActionRowBuilder, ButtonBuilder, ButtonStyle, SelectMenuBuilder, EmbedBuilder, } from "discord.js";
export default async function selectMenu(interaction, name) {
    await interaction.guild?.channels.fetch(interaction.channelId).then(async () => await interaction.message.delete().catch((e) => {
        return e;
    }));
    const row = new ActionRowBuilder().addComponents([
        new ButtonBuilder()
            .setCustomId("post|cancel")
            .setLabel("Cancel")
            .setStyle(ButtonStyle.Danger),
    ]);
    const row1 = new ActionRowBuilder().addComponents([
        new SelectMenuBuilder()
            .setCustomId("post")
            .setPlaceholder("Please Select One")
            .addOptions([
            {
                label: "Suggestion",
                value: "suggest",
                default: interaction.values[0] === "fhire" ? true : false,
            },
        ]),
    ]);
    const reply = new EmbedBuilder();
    reply.setTitle("Use the menu below to select the post type");
    interaction.channel?.send({ embeds: [reply], components: [row1, row] });
}
