const { readdirSync } = require("fs");

module.exports = (client) => {
  const { buttons } = client;
  const buttonFiles = readdirSync(`./src/buttons`).filter((f) =>
    f.endsWith(".js")
  );
  for (const file of buttonFiles) {
    const execFile = require(`../buttons/${file}`);
    if ("execute" in execFile && "data" in execFile && execFile.data.customId) {
      buttons.set(execFile.data.customId, execFile);
    }
  }
};
