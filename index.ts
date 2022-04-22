import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import { handleLogin, handleRegister } from "./auth";
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const jsonwebtoken = require("jsonwebtoken");
const prisma = new PrismaClient();
const app = express();

const port = 3001;
app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());
app.get("/", (req: Request, res: Response) => res.send("Hello World!"));
type ReqBody = {
  userName?: string;
  password: string;
  email: string;
};
app.post("/auth", async (req: Request, res: Response) => {
  const body: ReqBody = req.body;
  const { email, password, userName } = body;
  const user = await prisma.user.findFirst({
    include: {
      token: true,
    },
    where: { email },
  });
  let tokenId;
  console.log("rec user ", user);
  if (user == null) {
    const dname = userName ?? "no-name";
    tokenId = await handleRegister(dname, email, password, prisma);
  } else {
    tokenId = await handleLogin(email, password, user, prisma);
  }
  if (!tokenId) {
    return res.status(401).send({ messege: "wrong id or password!" });
  }
  // temperary method for auth, will use passwordless auth in future thats why token model
  const jwt = jsonwebtoken.sign({ tokenId }, process.env.TOKEN_KEY, {
    expiresIn: "12d",
  });
  return res.status(200).send({ jwt });
});

app.get("/auth", async (req: Request, res: Response) => {
  const { jwtToken } = req.query;
  // token model is unneccesary oveerhead here
  try {
    const decoded = jsonwebtoken.verify(jwtToken, process.env.TOKEN_KEY);
    const token = await prisma.token.findFirst({
      where: {
        id: decoded.tokenId,
      },
      include: {
        user: true,
      },
      rejectOnNotFound: true,
    });
    return res.status(200).send({ user: token?.user });
  } catch (err) {
    return res.status(401).send(err);
  }
});

app.listen(port, () => {
  prisma.$connect();
  console.log(`prisma connected & app listening on port ${port}!`);
});
