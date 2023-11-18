const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
  Client,
} = require("discord.js");
const buildHelpEmbed = require("../../utils/helpEmbed");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("See how to use the bot!"),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   * @returns
   */
  async execute(interaction, client) {
    await buildHelpEmbed(interaction, client);
  },
};
