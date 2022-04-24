import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import { handleLogin, handleRegister } from "./auth";
import { authenticateHandler, authenticateUser } from "./middleware/auth";
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
app.locals.prisma = prisma;
// parse application/json
app.use(bodyParser.json());
app.get("/", (req: Request, res: Response) => res.send("Hello World!"));
type ReqBody = {
  name?: string;
  password: string;
  email: string;
};

app.post("/auth", async (req: Request, res: Response) => {
  const body: ReqBody = req.body;
  const { email, password, name: userName } = body;
  console.log("rec body", body);
  if (!email || !password) {
    res.status(403).send({ messege: "either mail or password missing" });
  }
  const user = await prisma.user.findFirst({
    include: {
      token: true,
    },
    where: { email },
  });
  let tokenId;
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

app.get("/auth", authenticateUser, async (req: Request, res: Response) => {
  if (res.locals.user) {
    return res.status(200).send({ user: res.locals.user });
  } else {
    return res.status(403).send({ user: null });
  }
});

app.post("/auth/revoke", authenticateUser, (req: Request, res: Response) => {
  try {
    const { user } = res.locals;
    if (user) {
      prisma.token.update({
        where: { userId: user.id },
        data: {
          valid: false,
        },
      });
    }
    return res.status(200).send({ revoked: true });
  } catch (err) {
    return res.status(403).send({ revoked: false, error: err });
  }
});

app.post("/post", authenticateHandler, async (req, res) => {
  const { title, body, authorId } = req.body;
  try {
    if (!title || !body || !authorId) {
      throw Error("body not valid");
    }
    const post = await prisma.post.create({
      data: {
        body,
        title,
        authorId,
      },
    });
    res.send({ post });
  } catch (err) {
    res.status(501).send(err);
  }
});

app.get("/post", async (req, res) => {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
    },
  });
  return res.send({ posts });
});

app.listen(port, () => {
  prisma.$connect();
  console.log(`prisma connected & app listening on port ${port}!`);
});
