import { Context } from "telegraf";
import { SceneContext } from "telegraf/typings/scenes";

const { Telegraf, Stage, session, Scene } = require("telegraf");
const axios = require("axios");
require("dotenv").config();

const bot = new Telegraf(process.env.TOKEN);

axios.defaults.baseURL = process.env.BASE_URL;

bot.start((ctx: any) => {
  console.log(ctx.from.username + " has started the bot");
  bot.telegram.sendMessage(
    ctx.chat.id,
    "Hello " +
      ctx.from.username +
      ", this bot will help you find groups of people to" +
      ' "discuss" ' +
      "with for modules that you are taking. Please type /register [Room Number] to register your account, \n e.g /register B618" +
      "\n\n  /help for more information"
  );
});

bot.help((ctx: any) => {
  bot.telegram.sendMessage(
    ctx.chat.id,
    "This bot will help you find groups of people to cheat with for modules that you are taking. \n" +
      "/register [Room Number] in order to register your account \n" +
      "/add [Module Code] to add a module to your account \n" +
      "/list [Module Code] to find people to cheat with for a module \n" +
      "/delete [Module Code] to delete a module from your account"
  );
});

bot.command("register", (ctx: any) => {
  //console.log(ctx.message.text);
  const room = ctx.message.text.split(" ")[1];
  console.log(ctx.from.username + "has registered with room_num " + room);

  if (room == undefined) {
    bot.telegram.sendMessage(
      ctx.chat.id,
      "Please enter a room number after typing /register \n e.g /register B618"
    );
  } else {
    const room_num = room.toUpperCase();

    axios
      .post(
        "/create_user",
        { tag: ctx.from.username, room_number: room_num },
        {
          headers: { "Accept-Encoding": "gzip,deflate,compress" },
        }
      )
      .then((res: any) => {
        console.log(res.data);
        bot.telegram
          .sendMessage(
            ctx.chat.id,
            "Please wait while we register your account"
          )
          .then((res: any) => {
            const m_id = res.message_id;
            bot.telegram.editMessageText(
              ctx.chat.id,
              m_id,
              m_id,
              "Your account has been registered. Please input the modules you plan on taking using /add and the module code afterwards \n e.g /add CS1010S GESS1037 CS2040S GEA1000."
            );
          });
      });
  }
});

bot.command("add", (ctx: any) => {
  const modules = ctx.message.text.split(" ");
  modules.map((mod: any) => mod?.toUpperCase());
  modules.shift();
  console.log(ctx.from.username + " has added modules " + modules);
  if (modules.length == 0) {
    bot.telegram.sendMessage(
      ctx.chat.id,
      "Please input the modules you plan on taking after the /add field. \n e.g /add CS1010S GESS1037 CS2040S GEA1000."
    );
  } else {
    axios
      .post(
        "/add_modules",
        { tag: ctx.from.username, modules: modules },
        {
          headers: {
            "Accept-Encoding": "gzip,deflate,compress",
            "User-Agent": "axios 0.21.1",
          },
        }
      )
      .then((res: any) => {
        //console.log(res.data);
        bot.telegram.sendMessage(
          ctx.chat.id,
          "Your modules have been added.\n View others taking the same mod by typing \n /list *space* [MODULE]. Please input 1 module at a time \n e.g.  /list CS1010S. \n \n You may delete your name from modules using /delete CS1010S"
        );
      });
  }
});

bot.command("list", (ctx: any) => {
  const lmod = ctx.message.text.split(" ")[1];
  console.log(ctx.from.username + "has listed " + lmod);
  if (lmod == undefined) {
    bot.telegram.sendMessage(
      ctx.chat.id,
      "Please input the module code you would like to search for. \n e.g /list CS1010S"
    );
  } else {
    const mod = lmod.toUpperCase();
    axios
      .get(
        "/module",
        {
          data: {
            module: mod,
          },
        },
        {
          headers: {
            "Accept-Encoding": "gzip,deflate,compress",
            "User-Agent": "axios 0.21.1",
          },
        }
      )
      .then((res: any) => {
        if (res.data.length == 0) {
          bot.telegram.sendMessage(
            ctx.chat.id,
            "Sorry, no one has registered for this module yet. Check back again later!"
          );
        } else {
          bot.telegram.sendMessage(
            ctx.chat.id,
            "The following users are taking the module " +
              mod +
              ":\n \n" +
              res.data
                .map(
                  (user: any) =>
                    "@" +
                    user.user_name +
                    "     Room No. " +
                    user.student.room_num
                )
                .join("\n")
          );
        }
      });
  }
});

bot.command("delete", (ctx: any) => {
  const mod = ctx.message.text.split(" ")[1]?.toUpperCase();
  console.log(ctx.from.username + "has deleted name from" + mod);
  if (mod == undefined) {
    bot.telegram.sendMessage(
      ctx.chat.id,
      "Please input the module code you would like to delete. \n e.g /delete CS1010S"
    );
  } else {
    axios
      .delete(
        "/module",
        {
          data: {
            module: mod,
            user: ctx.from.username,
          },
        },
        {
          headers: {
            "Accept-Encoding": "gzip,deflate,compress",
            "User-Agent": "axios 0.21.1",
          },
        }
      )
      .then((res: any) => {
        console.log(res.data);
        bot.telegram.sendMessage(
          ctx.chat.id,
          "Your name has been removed from module " + mod
        );
      });
  }
});

// const stage = new Stage();
// stage.register("register");

// const register = new Scene("register");
// register.enter((ctx: Context) => ctx.reply("Please input your room number"));
// register.on("message", (ctx: any) => ctx.reply(ctx.message.text));

// bot.use(session());
// bot.use(stage.middleware());
// bot.command("greeter", (ctx: SceneContext) => ctx.scene.enter("greeter"));

bot.launch();
