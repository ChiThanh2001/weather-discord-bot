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

client.on("ready", function () {
  client.user.setUsername("Weather bot");
});

client.on("roleCreate", (role) => {
  console.log(role.name, role.permissions);
});

client.on("messageCreate", (message) => {});

client.on("channelCreate", (channel) => {
  console.log("New channel created: " + channel.name);
});

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
        //call api theo tên thành phố để lấy lat và lon
        const response = await fetch(
          `http://api.openweathermap.org/geo/1.0/direct?q=${cmdName}&appid=${apikeyWeather}`
        );

        //convert data nhận đc
        const data = await response.json();

        //kiểm tra nếu data trả về mảng rỗng(không tìm thấy thành phố) thì gửi msg như dưới
        if (data.length === 0) {
          msg.channel.send(
            `Xin lỗi bạn,hiện tại tôi không có dữ liệu và thành phố ${cmdName}`
          );
          return;
        }

        const lat = data[0].lat;
        const lon = data[0].lon;
        //call api theo lat và lon tìm đc bên trên theo tên thành phố
        const weather = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikeyWeather}`
        );

        //convert data
        const weatherData = await weather.json();

        //chuyển thành độ C
        const temperature = (weatherData.main.temp - 273.15).toFixed();

        //send msg
        msg.channel.send(
          `Nhiệt độ tại ${data[0].name} bây giờ là ${temperature}°C`
        );
      } catch (e) {
        msg.channel.send("Đm các bạn");
      }
    }
  }
});

client.login(token);
