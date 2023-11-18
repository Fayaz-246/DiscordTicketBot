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

module.exports = {
  data: { customId: "lock-ticket" },
  /**
   *
   * @param {Interaction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guildId, member, guild, user, channel } = interaction;
    const { config } = client;
    const embed = new EmbedBuilder();
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
    if (openedData.Closed)
      return await interaction.reply({
        ephemeral: true,
        content: "This ticket is already closed.",
      });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("unlock-ticket")
        .setEmoji("🔓")
        .setLabel("Unlock")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("delete")
        .setEmoji("🗑️")
        .setLabel("Delete")
        .setStyle(ButtonStyle.Danger)
    );
    channel.permissionOverwrites.set([
      { id: guildId, deny: [PermissionFlagsBits.ViewChannel] },
      {
        id: openedData.UserID,
        allow: [PermissionFlagsBits.ViewChannel],
        deny: [PermissionFlagsBits.SendMessages],
      },
      {
        id: data.ManagerRole,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
        ],
      },
    ]);
    openedData.Closed = true;
    await openedData.save();
    await interaction.reply({
      components: [row],
      embeds: [
        embed.setColor(errorColor).setDescription("🔒 **Locked the channel!**"),
      ],
    });
  },
};
