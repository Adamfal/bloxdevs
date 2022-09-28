import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, } from "discord.js";
import config from "../../../config.json" assert { type: "json" };
import { QuickDB } from "quick.db";
const db = new QuickDB();
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
export default async function modal(interaction, name) {
    if (name === "createModal") {
        let current = await db.get(interaction.user.id);
        if (current)
            return interaction.reply({
                ephemeral: true,
                content: "Please wait for your current post to be approved/denied to make a new post",
            });
        let methodToSymbol = {
            robux: "⏣ ",
            paypal: "$",
            other: "",
        };
        let data = {
            type: interaction.customId.split("|")[2],
            section: interaction.customId.split("|")[3],
        };
        let possibleMethods = ["paypal", "robux", "other"];
        if (!possibleMethods.includes(interaction.fields.getTextInputValue("method").toLowerCase()))
            return interaction.reply({
                ephemeral: true,
                content: "Method must be one of the following **paypal**, **robux**, **other**",
            });
        if (isNaN(Number(interaction.fields.getTextInputValue("price"))) ||
            !Number.isInteger(Number(interaction.fields.getTextInputValue("price"))) ||
            !(Number(interaction.fields.getTextInputValue("price")) > 0))
            return interaction.reply({
                ephemeral: true,
                content: "Price must be a positive integer",
            });
        interaction.guild?.channels.fetch(config.staff).then((c) => c.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle((data.section === "fhire"
                    ? "For Hire | "
                    : "Looking to Hire | ") +
                    capitalizeFirstLetter(data.type) +
                    " | " +
                    interaction.user.tag)
                    .setDescription(`Description: ${interaction.fields.getTextInputValue("description")}\n\nRequierments: ${interaction.fields.getTextInputValue("requierments")}\n\nPrice: ${methodToSymbol[interaction.fields.getTextInputValue("method").toLowerCase()]}${Number(interaction.fields.getTextInputValue("price")).toLocaleString()}\nPayment Method: ${capitalizeFirstLetter(interaction.fields.getTextInputValue("method").toLowerCase())}`)
                    .setFooter({
                    text: "UserID: " + interaction.user.id,
                }),
            ],
            components: [
                new ActionRowBuilder().addComponents([
                    new ButtonBuilder()
                        .setCustomId("post|approve")
                        .setStyle(ButtonStyle.Success)
                        .setLabel("Approve"),
                    new ButtonBuilder()
                        .setCustomId("post|deny")
                        .setStyle(ButtonStyle.Danger)
                        .setLabel("Deny"),
                ]),
            ],
        }));
        interaction.reply({
            content: `Post submitted for approval.`,
            ephemeral: true,
        });
        db.set(interaction.user.id, true);
        await interaction.guild?.channels.fetch(interaction.channelId).then(async () => await interaction.message.delete().catch((e) => {
            return e;
        }));
    }
}
