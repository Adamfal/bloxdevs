import CMDHandler from "./Handlers/CommandHandler.js";
import { Client, IntentsBitField, Partials, GatewayIntentBits, } from "discord.js";
import RegisterCommands from "./Functions/RegisterCommands.js";
import config from "../config.json" assert { type: "json" };
export const client = new Client({
    intents: [
        IntentsBitField.Flags.GuildIntegrations,
        IntentsBitField.Flags.GuildMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Message],
});
const CommandHandler = new CMDHandler();
client.on("ready", async () => {
    client?.application?.commands.set(CommandHandler.commands);
    RegisterCommands(CommandHandler, client);
    console.log("Ready!");
});
client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) {
        CommandHandler.run(interaction, interaction.commandName);
    }
    if (interaction.isAutocomplete()) {
        CommandHandler.autocomplete(interaction, interaction.commandName);
    }
    if (interaction.isButton()) {
        CommandHandler.button(interaction, interaction.customId.split("|")[0]);
    }
    if (interaction.isSelectMenu()) {
        CommandHandler.selectMenu(interaction, interaction.customId.split("|")[0]);
    }
    if (interaction.isModalSubmit()) {
        CommandHandler.modal(interaction, interaction.customId.split("|")[0]);
    }
});
client.login(process.env.token);
