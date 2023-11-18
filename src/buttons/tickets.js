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
  data: { customId: "tickets" },
  /**
   *
   * @param {Interaction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guildId, member, guild, user } = interaction;
    const { config } = client;
    const { embedColor, successColor, emojis, errorColor } = config;

    const data = await ticketSettings.findOne({ GuildID: guildId });
    const openedData = await ticketData.findOne({
      GuildID: guildId,
      UserID: user.id,
    });
    if (!data)
      return await interaction.reply({
        ephemeral: true,
        content:
          "⁉️ Looks like you found a message, but the ticket system is disabled in this server!",
      });

    if (openedData) {
      return await interaction.reply({
        content: `It looks like you already have a ticket open in <#${openedData.ChannelID}>!`,
        ephemeral: true,
      });
    }

    const category = await guild.channels.cache.get(data.CategoryID);
    const ticketChannel = await category.children.create({
      name: `${rand(user)}`,
      topic: `A new ticket opened by ${user.globalName}!`,
      permissionOverwrites: [
        { id: guildId, deny: [PermissionFlagsBits.ViewChannel] },
        {
          id: user.id,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
          ],
        },
        {
          id: data.ManagerRole,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
          ],
        },
      ],
    });
    const ts = `<t:${Math.floor(Date.now() / 1000)}>`;
    await ticketData.create({
      GuildID: guildId,
      UserID: user.id,
      ChannelID: ticketChannel.id,
      Closed: false,
      Timestamp: ts,
    });
    const embed = new EmbedBuilder()
      .setColor(embedColor)
      .setTitle("New Ticket!")
      .setDescription("A new ticket has been opened!")
      .addFields(
        { name: "Opened By: ", value: `> \`${user.username}\``, inline: true },
        { name: "User ID: ", value: `> \`${user.id}\``, inline: true },
        {
          name: "Timestamp : ",
          value: `> ${ts}`,
        }
      );

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("lock-ticket")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("🔒")
        .setLabel("Lock")
    );

    const m = await ticketChannel.send({
      content: `<@&${data.ManagerRole}>`,
      embeds: [embed],
      components: [row],
    });
    await interaction.reply({
      ephemeral: true,
      content: `Opened a ticket at - <#${ticketChannel.id}>!`,
    });
    await m.pin();
  },
};

function rand(user) {
  let num = Math.floor(Math.random() * 1000 + 1);
  return `ticket-${user.username}-${num}`;
}
