require("colors");
const mongo = require("mongoose");

module.exports = (client) => {
  const uri = process.env.MongoURI;
  if (!uri)
    return console.log(`[WARN]`.yellow + " Aborting DB connection. (NO URI)");
  mongo.connect(uri);

  const { connection } = mongo;

  connection.on("connected", () => {
    console.log("[INFO]".blue + " Connected to DB!");
  });

  connection.on("disconnected", () => {
    console.log("[INFO]".blue + " Disconnected from DB.");
  });

  connection.on("err", (err) => {
    console.log("[DB ERR]".red + ` DB ERR: \n${err}`);
  });
};
