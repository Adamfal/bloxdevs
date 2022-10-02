
module.exports = {
    name: "members",
    description: "BloxDevs Members!",
    run: async (client,interaction) => {
        return interaction.followUp({ content:`**Members**: ${interaction.guild.memberCount}` });
    }
}