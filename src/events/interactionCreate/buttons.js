const { Client, Interaction, EmbedBuilder } = require("discord.js");

/**
 *
 * @param {Client} client
 * @param {Interaction} interaction
 */
module.exports = async (client, interaction) => {
  if (!interaction.isButton()) return;
  const { buttons, config } = client;
  const { customId } = interaction;
  const button = buttons.get(customId);
  if (!button) return;
  try {
    await button.execute(interaction, client);
  } catch (err) {
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(config.errorColor)
          .setTitle("An error occured!")
          .setDescription(`Please report this error: \`\`\`js\n${err}\`\`\``),
      ],
      ephemeral: true,
    });
    console.error(err);
  }
};
