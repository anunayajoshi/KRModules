// const TelegramBot = require("node-telegram-bot-api");
// require("dotenv").config();
// const axios = require("axios");

// axios.defaults.baseURL = process.env.BASE_URL;

// const token = process.env.TOKEN;

// const bot = new TelegramBot(token, { polling: true });

// bot.on("polling_error", console.log);

// bot.on("message", (message: any) => {
//   console.log(message.text);
//   console.log(message.from.username);
//   axios
//     .get("/users")
//     .then((res: any) => {
//       console.log(res.data);
//     })
//     .catch(function (error: any) {
//       // handle error
//       console.log("This is error", error);
//     })
//     .then(function () {
//       // always executed
//     });
// });
