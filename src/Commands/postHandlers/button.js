import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, } from "discord.js";
import config from "../../../config.json" assert { type: "json" };
import { QuickDB } from "quick.db";
const db = new QuickDB();
export default async function button(interaction, name) {
    if (name === "cancel") {
        interaction.message.delete().catch((e) => {
            return e;
        });
    }
    else if (name === "suggestion" ||
        name === "GFX") {
        const createModal = new ModalBuilder()
            .setCustomId("post|createModal|" + name + "|" + interaction.customId.split("|")[2])
            .setTitle("BloxDevs | Suggest ");
        const description = new TextInputBuilder()
            .setCustomId("description")
            .setLabel("What is your suggestion?")
            .setStyle(TextInputStyle.Paragraph)
            .setMinLength(150)
            .setMaxLength(300)
        createModal.addComponents(new ActionRowBuilder().addComponents(description), new ActionRowBuilder().addComponents(requierments), new ActionRowBuilder().addComponents(method), new ActionRowBuilder().addComponents(price));
        await interaction.showModal(createModal);
    }
    else if (name === "approve") {
        interaction.guild?.channels
            .fetch(config.posts)
            .then((c) => c.send({ embeds: [interaction.message.embeds[0]] }));
        interaction.client.users
            .fetch(interaction.message.embeds[0].footer?.text
            .split(":")[1]
            .replace(/ /g, ""))
            .then((u) => u.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Post Approved")
                    .setDescription("Your post was approved by the mods.")
                    .setColor(0x00ff00),
            ],
        }));
        db.set(interaction.message.embeds[0].footer?.text
            .split(":")[1]
            .replace(/ /g, ""), false);
        interaction.reply({
            content: "Approved. Deleting embed in 3s.....",
            ephemeral: true,
        });
        setTimeout(() => interaction.guild?.channels.fetch(interaction.channelId).then(async () => await interaction.message.delete().catch((e) => {
            return e;
        })), 3000);
    }
    else if (name === "deny") {
        const filter = (m) => m.author.id === interaction.user.id;
        interaction.reply({ ephemeral: true, content: "Please Supply a Reason" });
        interaction.channel
            ?.awaitMessages({ filter, max: 1, time: 60000, errors: ["time"] })
            .then((c) => {
            interaction.client.users
                .fetch(interaction.message.embeds[0].footer?.text
                .split(":")[1]
                .replace(/ /g, ""))
                .then((u) => u.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Post Denied")
                        .setDescription(`Your post was denied by the mods.\n\nReason: ${c.first()?.content}\n\nPlease review the reason and resubmit.`)
                        .setColor(0xff0000),
                ],
            }));
            db.set(interaction.message.embeds[0].footer?.text
                .split(":")[1]
                .replace(/ /g, ""), false);
            c.first()
                ?.delete()
                .catch((e) => {
                return e;
            });
            interaction.editReply("Denied. Deleting Embed in 3s......");
            setTimeout(() => interaction.guild?.channels.fetch(interaction.channelId).then(async () => await interaction.message.delete().catch((e) => {
                return e;
            })), 3000);
        })
            .catch(() => {
            interaction.editReply({
                content: "Out of time",
            });
        });
    }
}
