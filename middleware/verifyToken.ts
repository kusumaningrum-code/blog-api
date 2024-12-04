import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //decrypt token from request header
    console.log("from request header", req.headers);
    const token = req.headers.authorization?.split(" ")[1];
    console.log(token);
    if (!token) {
      throw { rc: 404, status: false, message: "token not exist" };
    }
    const checkToken = verify(token, process.env.TOKEN_KEY || "test");
    console.log(checkToken);

    res.locals.decript = checkToken;

    //meneruskan proses ke controller selanjutnya

    next();
  } catch (error: any) {
    res.status(401).send({
      message: "unauthorised token, is invalid",
      success: false,
    });
  }
};
