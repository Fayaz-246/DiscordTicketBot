const { EmbedBuilder, Client, Interaction } = require("discord.js");
const { embedColor } = require("../config");

const embed = new EmbedBuilder().setColor(embedColor);

/**
 *
 * @param {Client} client
 * @param {Interaction} i
 */
const buildHelpEmbed = async (i, client) => {
  embed
    .setAuthor({
      iconURL: `${client.user.displayAvatarURL()}`,
      name: `${client.user.username}'s Help menu`,
    })
    .setFooter({
      iconURL: `${i.user.displayAvatarURL()}`,
      text: `Requested By: ${i.user.globalName}`,
    })
    .setTimestamp()
    .setTitle("Help Menu.")
    .setDescription(
      `See a list of all my commands below - \n> \`/ticket setup\` ~ *Setup the ticket system in your server!*\n> \`/ticket disbale\` ~ *Remove the ticket system from your server.*\n> \`/ticket send\` ~ *Send the ticket embed to a channel*\n> \`/ticket config role\` ~ *Change the ticket manager role.*\n> \`/ticket config channel\` ~ *Change the ticket transcripts channel*\n> \`/ticket config category\` ~ *Change the category in which the tickets will be created.*`
    );

  return await i.reply({ embeds: [embed], ephemeral: true });
};

module.exports = buildHelpEmbed;
