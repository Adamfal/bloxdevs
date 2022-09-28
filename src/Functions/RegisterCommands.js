export default function RegisterCommands(commandHandler, client) {
    client?.application?.commands.set(commandHandler.commands);
}
