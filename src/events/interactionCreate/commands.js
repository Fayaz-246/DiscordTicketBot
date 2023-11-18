const {
  EmbedBuilder,
  Client,
  ChatInputCommandInteraction,
} = require("discord.js");

/**
 *
 * @param {Client} client
 * @param {ChatInputCommandInteraction} interaction
 * @returns
 */
module.exports = async (client, interaction) => {
  if (!interaction.guild)
    return interaction.reply({
      content: "Slash commands can only be used in guilds",
    });

  if (!interaction.isCommand()) return;
  const config = client.config;
  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.log(error);
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(config.errorColor)
          .setTitle("An Error Occured While Using This Command.")
          .setDescription(
            `Please report this error: \n\`\`\`js\n${error}\`\`\``
          ),
      ],
      ephemeral: true,
    });
  }
};
