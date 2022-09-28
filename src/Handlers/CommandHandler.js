import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import fs from "fs";
export default class CommandHandler {
    cmds;
    constructor() {
        this.cmds = {};
        let commandFolder = "../Commands/";
        fs.readdirSync(__dirname + "/" + commandFolder).forEach(async (file) => {
            if (file.endsWith(".js")) {
                let command = (await import(`file://${__dirname}/${commandFolder}/${file}`)).default;
                this.cmds[command.name] = command;
            }
        });
    }
    get commands() {
        let commands = [];
        Object.values(this.cmds).map((x) => {
            let data = {
                name: x.name,
                description: x.description,
            };
            if (x.options)
                data["options"] = x.options;
            commands.push(data);
        });
        return commands;
    }
    run(interaction, name) {
        if (this.cmds[name]) {
            let command = this.cmds[name];
            command.execute?.(interaction);
        }
        else {
            interaction.reply({ content: "Command not found", ephemeral: true });
        }
    }
    async autocomplete(interaction, name) {
        if (this.cmds[name]) {
            let command = this.cmds[name];
            command.autocomplete?.(interaction);
        }
    }
    async button(interaction, cmdName) {
        if (this.cmds[cmdName]) {
            let command = this.cmds[cmdName];
            command.button?.(interaction, interaction.customId.split("|")[1]);
        }
    }
    async modal(interaction, cmdName) {
        if (this.cmds[cmdName]) {
            let command = this.cmds[cmdName];
            command.modal?.(interaction, interaction.customId.split("|")[1]);
        }
    }
    async selectMenu(interaction, cmdName) {
        if (this.cmds[cmdName]) {
            let command = this.cmds[cmdName];
            command.selectMenu?.(interaction, interaction.customId.split("|")[1]);
        }
    }
}
