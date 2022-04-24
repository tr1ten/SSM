import { NextFunction, Request, Response } from "express";
const jsonwebtoken = require("jsonwebtoken");

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const jwtToken  =
  req.query.jwtToken || req.headers.authorization?.split(" ")[1] || req.body.jwt;
  const { prisma } = req.app.locals;
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
    if (!token.valid) {
      throw new Error("invalid token");
    }
    res.locals.user = token?.user;
    return next();
  } catch (err) {
    res.locals.user = null;
    return next();
  }
};

export const authenticateHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const jwtToken  =
    req.query.jwtToken || req.headers.authorization?.split(" ")[1] || req.body.jwt;
  const { prisma } = req.app.locals;
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
    if (!token.valid) {
      throw new Error("invalid token");
    }
    res.locals.user = token?.user;
    return next();
  } catch (err) {
    res.locals.user = null;
    return next(new Error(`user not authenticated ${err}`));
  }
};
