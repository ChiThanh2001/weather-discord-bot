const { Client, Guild, GatewayIntentBits, Events } = require("discord.js");
const { token, apikeyWeather } = require("./config.json");
const fetch = require("node-fetch-npm");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const PREFIX = "!";

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on("roleCreate", (role) => {
  console.log(role.name, role.permissions);
});

client.on("messageCreate", (message) => {});

// client.on("channelCreate", (channel) => {
//   console.log(channel.members);
// });

client.on("channelCreate", (channel) => {
  console.log("New channel created: " + channel.name);
});

// client.on("messageCreate", (message) => {
//   const channelName = message.channel.name;
//   console.log(channelName);
//   const guildName = message.channel.guild.name;
//   console.log(
//     `Message sent in server: ${guildName} and in channel ${channelName}`
//   );
// });

client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;
  const command = msg.content.startsWith(PREFIX);
  if (command) {
    const [cmdName, ...args] = msg.content.substring(1).split(" ");
    if (cmdName === "help") {
      msg.channel.send(
        "dùng ! + tên thành phố viết liền không cách,không dấu để xem nhiệt độ.Ví dụ : !Hanoi"
      );
    }
    if (cmdName) {
      try {
        const response = await fetch(
          `http://api.openweathermap.org/geo/1.0/direct?q=${cmdName}&appid=${apikeyWeather}`
        );
        const data = await response.json();
        if (data.length === 0) {
          msg.channel.send(
            `Xin lỗi bạn,hiện tại tôi không có dữ liệu và thành phố ${cmdName}`
          );
          return;
        }
        const lat = data[0].lat;
        const lon = data[0].lon;

        const weather = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikeyWeather}`
        );

        const weatherData = await weather.json();
        const temperature = (weatherData.main.temp - 273.15).toFixed();
        console.log(temperature);
        msg.channel.send(`Nhiệt độ tại ${cmdName} bây giờ là ${temperature}°C`);
      } catch (e) {
        msg.channel.send("Đm các bạn");
      }
    }
  }
});

client.login(token);
