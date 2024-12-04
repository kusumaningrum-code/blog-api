import { Router, Request, Response, NextFunction } from "express";
import {
  signIn,
  register,
  keepLogin,
  updateProfile,
} from "../controllers/userController";
import { verify } from "jsonwebtoken";
import { verifyToken } from "../middleware/verifyToken";

const route = Router();

route.post("/register", register);
route.post("/login", signIn);
route.get("/keep-login", verifyToken, keepLogin);
route.patch("/update", verifyToken, updateProfile);
export default route;
