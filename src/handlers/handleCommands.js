require("colors");
const { readdirSync } = require("fs");
const { REST, Routes } = require("discord.js");

module.exports = (client) => {
  const commandFolders = readdirSync("./src/commands");
  client.commandArray = [];

  for (folder of commandFolders) {
    const commandFiles = readdirSync(`./src/commands/${folder}`).filter(
      (file) => file.endsWith(".js")
    );
    for (const file of commandFiles) {
      const command = require(`../commands/${folder}/${file}`);
      if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
        client.commandArray.push(command.data.toJSON());
      } else {
        console.log(`${file} is missing "data" or "execute".`.yellow);
      }
    }
  }

  const rest = new REST({
    version: "9",
  }).setToken(process.env.Token);

  (async () => {
    try {
      console.log(
        "[CMDS]".red +
          ` Started refrshing ${client.commandArray.length} application ( / ) commands`
      );

      await rest.put(Routes.applicationCommands(process.env.ClientID), {
        body: client.commandArray,
      });

      console.log(
        "[CMDS]".green +
          ` Successfully ${client.commandArray.length} refreshed application ( / ) commands`
      );
    } catch (error) {
      console.error(
        `Error while registring application commands: \n${error}`.red
      );
    }
  })();
};
