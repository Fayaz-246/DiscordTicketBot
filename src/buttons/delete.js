const {
  Interaction,
  Client,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
} = require("discord.js");
const ticketSettings = require("../schemas/ticketSettings");
const ticketData = require("../schemas/ticket");
const { createTranscript } = require("discord-html-transcripts");

module.exports = {
  data: { customId: "delete" },
  /**
   *
   * @param {Interaction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guildId, member, guild, user, channel } = interaction;
    const { config } = client;
    const { embedColor, successColor, emojis, errorColor } = config;

    const data = await ticketSettings.findOne({ GuildID: guildId });
    if (!member.roles.cache.has(data.ManagerRole))
      return await interaction.reply({
        ephemeral: true,
        content: "🛠️ You do not have permission to use this button...",
      });

    const openedData = await ticketData.findOne({
      GuildID: guildId,
      ChannelID: channel.id,
    });
    if (!openedData)
      return await interaction.reply({
        ephemeral: true,
        content: "🛠️ Something went wrong...",
      });

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(errorColor)
          .setDescription("🗑️ **Deleting channel...**"),
      ],
    });

    const openedBy = guild.members.cache.get(openedData.UserID);
    const transcript = await createTranscript(channel, {
      limit: -1,
      returnBuffer: false,
      filename: `${channel.name}.html`,
    });
    const embed = new EmbedBuilder()
      .setColor(embedColor)
      .setTitle("Ticket Deleted!")
      .addFields(
        {
          name: "Opened By: ",
          value: `\`${openedBy.user.username}\``,
          inline: true,
        },
        { name: "Closed By: ", value: `\`${user.username}\``, inline: true },
        {
          name: "Opened At: ",
          value: `${openedData.Timestamp}`,
          inline: false,
        },
        {
          name: "Closed At: ",
          value: `<t:${Math.floor(Date.now() / 1000)}>`,
          inline: false,
        }
      );
    const transcriptsChannel = await guild.channels.cache.get(
      data.TranscriptsID
    );
    let msg = await transcriptsChannel.send({
      content: "TRANSCRIPT CACHE",
      files: [transcript],
    });
    const transcriptMessage = `📄 **Here is the ticket's [transcript](https://mahto.id/chat-exporter?url=${
      msg.attachments.first()?.url
    })**`;
    await msg.delete().catch(() => {});
    await ticketData.findOneAndDelete({
      GuildID: guildId,
      ChannelID: channel.id,
    });
    openedBy
      .send(
        `Your ticket has been closed by: ${interaction.user.username}\n${transcriptMessage}`
      )
      .catch(() => {});
    embed.addFields({ name: "Transcript: ", value: `> ${transcriptMessage}` });
    await transcriptsChannel.send({
      embeds: [embed],
    });
    await channel.delete();
  },
};
