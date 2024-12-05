import { Router } from "express";
import {
  createFollow,
  getFollowers,
  getFollowing,
  deleteFollow,
} from "../controllers/followerController";

const route = Router();

route.post("/follow", createFollow);
route.get("/followers/:userId", getFollowers);
route.get("/following/:userId", getFollowing);
route.delete("/follow/:followerId/:followingId", deleteFollow);

export default route;
