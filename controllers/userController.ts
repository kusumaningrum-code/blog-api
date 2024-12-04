import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";
import { hashPassword } from "../utils/hashPassword";
import { compareSync } from "bcrypt";
import { sign } from "jsonwebtoken";
import ResponseHandler from "../utils/responseHandler";
import responseHandler from "../utils/responseHandler";
export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    // Check user account
    const isExistUser = await prisma.user.findUnique({
      where: { email: req.body.email },
    });
    console.log(isExistUser);
    if (isExistUser) {
      //throw {
      // rc: 400,
      // message: `${req.body.email} is exist. Use other email account`,
      return ResponseHandler.error(
        res,
        `${req.body.email} is exist. Use other email account`,
        400
      );
    }

    const newPassword = await hashPassword(req.body.password);
    await prisma.user.create({
      data: { ...req.body, password: newPassword },
    });

    return responseHandler.success(res, "Your signup Successfully", 201);
  } catch (error: any) {
    console.log(error);
    return ResponseHandler.success(res, "Your sign", error.rc || 500, error);
  }
};

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    //const { email, password } = req.body;

    const findUser = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });

    if (!findUser) {
      throw {
        rc: 404,
        message: "Account doesn't exist",
      };
    }
    //cek pass
    const comparePass = compareSync(req.body.password, findUser.password);
    if (!comparePass) {
      throw { rc: 401, message: "Password is wrong" };
    }

    const token = sign(
      { id: findUser.id, email: findUser.email },
      process.env.TOKEN_KEY || "test"
    );
    return res.status(200).send({
      username: findUser.username,
      email: findUser.email,
      token,
    });
  } catch (error: any) {
    console.log(error);
    next({
      rc: error.rc || 500,
      message: "Login failed",
      success: false,
      error: error.message,
    });
  }
};

export const keepLogin = async (req: Request, res: Response): Promise<any> => {
  try {
    //data from middleware token
    console.log("at keeplogin controller", res.locals.decript);
    const findUser = await prisma.user.findUnique({
      where: { id: res.locals.decript.id },
    });
    if (!findUser) {
      throw {
        rc: 404,
        message: "Account doesn't exist",
      };
    }
    const token = sign(
      { id: findUser.id, email: findUser.email },
      process.env.TOKEN_KEY || "test"
    );
    return res.status(200).send({
      username: findUser.username,
      email: findUser.email,
      token,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(error.rc || 500).send({
      message: "Your keepLogin is failed",
      success: false,
      error: error.message,
    });
  }
};

export const updateProfile = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: res.locals.decript.id,
      },
      data: req.body,
    });

    const token = sign(
      { id: updatedUser.id, email: updatedUser.email },
      process.env.TOKEN_KEY || "test"
    );
    return res.status(200).send({
      username: updatedUser.username,
      email: updatedUser.email,
      token,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(error.rc || 500).send({
      message: "Your update is failed",
      success: false,
      error: error.message,
    });
  }
};
