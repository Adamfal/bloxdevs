import { ActionRowBuilder, ButtonBuilder, ButtonStyle, SelectMenuBuilder, EmbedBuilder, } from "discord.js";
export default async function selectMenu(interaction, name) {
    await interaction.guild?.channels.fetch(interaction.channelId).then(async () => await interaction.message.delete().catch((e) => {
        return e;
    }));
    const row = new ActionRowBuilder().addComponents([
        new ButtonBuilder()
            .setCustomId(`post|scripting|${interaction.values[0]}`)
            .setLabel("Scripting")
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId(`post|modelling|${interaction.values[0]}`)
            .setLabel("Modelling")
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId(`post|GFX|${interaction.values[0]}`)
            .setLabel("GFX")
            .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
            .setCustomId(`post|Animator|${interaction.values[0]}`)
            .setLabel("Animator")
            .setStyle(ButtonStyle.Primary),
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
                label: "For Hire",
                value: "fhire",
                default: interaction.values[0] === "fhire" ? true : false,
            },
            {
                label: "Looking to Hire",
                value: "thire",
                default: interaction.values[0] === "thire" ? true : false,
            },
        ]),
    ]);
    const reply = new EmbedBuilder();
    reply.setTitle("Use the menu below to select the post type");
    interaction.channel?.send({ embeds: [reply], components: [row1, row] });
}
