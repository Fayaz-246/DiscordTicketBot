require("colors");
const { Client } = require("discord.js");

/**
 *
 * @param {Client} client
 */
module.exports = (client) => {
  console.log(`[INFO]`.blue + ` ${client.user.username} is online!`);
};
