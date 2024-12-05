import express from "express";
import {
  createArticle,
  updateArticle,
  deleteArticle,
  getArticle,
  articleDetail,
} from "../controllers/articleController";

const route = express.Router();
route.post("/articles", createArticle);
route.patch("/articles/:id", updateArticle);
route.get("/articles", getArticle);
route.delete("/articles/:id", deleteArticle);
route.get("/articles/:id", articleDetail);
export default route;
