import express from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import cors from "cors";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/users", async (req, res) => {
  const users = await prisma.users.findMany({});
  console.log(users);
  res.json(users);
});

app.post("/create_user", async (req, res) => {
  const { tag, room_number } = req.body;
  console.log(tag, room_number);
  const user = await prisma.users.upsert({
    where: {
      name: tag,
    },
    update: {
      name: tag,
      room_num: room_number,
    },
    create: {
      name: tag,
      room_num: room_number,
    },
  });
  res.json(user);
});

app.post("/add_modules", async (req, res) => {
  const { tag, modules } = req.body;

  //   const modCreation = await prisma.modules.createMany({
  //     data: modules.map((mod: any) => ({
  //       name: mod,
  //     })),
  //     skipDuplicates: true,
  //   });

  // const userMod = await prisma.modReg.create({
  //   data: {
  //     user_name: tag,
  //     mod_name: mod,
  //   },
  // });
  const userMod = await prisma.modReg.createMany({
    data: modules.map((mod: any) => ({
      user_name: tag,
      mod_name: mod,
    })),
    skipDuplicates: true,
  });
  res.json("Modules added");
});

app.get("/module", async (req, res) => {
  const { module } = req.body;
  // return all users who have module and their room number
  const modUsers = await prisma.modReg.findMany({
    where: {
      mod_name: module,
    },
    select: {
      user_name: true,
      student: {
        select: {
          room_num: true,
        },
      },
    },
  });
  res.json(modUsers);
  console.log(modUsers);
});

app.delete("/module", async (req, res) => {
  const { module, user } = req.body;
  const modUser = await prisma.modReg.deleteMany({
    where: {
      mod_name: module,
      user_name: user,
    },
  });
  res.json(modUser);
});

const server = app.listen(process.env.PORT || 3000);
console.log("Server is running on http://localhost:3000");
