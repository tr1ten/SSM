import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const bcrypt = require("bcrypt");
export const handleRegister = async (
  userName: string,
  email: string,
  password: string,
  prisma: PrismaClient
) => {
  const epass = await bcrypt.hash(password, 10);
  const expDate = new Date();
  expDate.setDate(expDate.getDate() + 12);
  const user = await prisma.user.create({
    data: {
      email,
      password: epass,
      name: userName,
    },
  });
  const token = await prisma.token.create({
    data: {
      expiration: expDate,
      userId: user.id,
    },
  });
  return token.id;
};

export const handleLogin = async (
  email: string,
  password: string,
  foundUser: any,
  prisma: PrismaClient
): Promise<string | null> => {
  const expDate = new Date();
  expDate.setDate(expDate.getDate() + 12);
  const isSame = bcrypt.compareSync(password, foundUser.password);
  if (isSame) {
    const token = await prisma.token.update({
      where: {
        userId: foundUser.id,
      },
      data: {
        expiration: expDate,
      },
    });
    return token.id;
  } else {
    return null;
  }
};
