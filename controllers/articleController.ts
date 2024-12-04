import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export const createArticle = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).send({
        message: "Missing required fields: title or content",
        success: false,
      });
    }
    const article = await prisma.article.create({
      data: {
        title,
        content,
      },
    });

    res.status(201).send({
      message: "Article created successfully",
      success: true,
      result: article,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Failed to create article",
      success: false,
    });
  }
};

export const updateArticle = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const updateData: any = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).send({
        message: "Missing required fields: title or content",
        success: false,
      });
    }
    const updatedArticle = await prisma.article.update({
      where: {
        id: parseInt(id),
      },
      data: updateData,
    });

    res.status(200).send({
      message: "Article updated successfully",
      success: true,
      result: updatedArticle,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Failed to update article",
      success: false,
    });
  }
};

export const getArticle = async (req: Request, res: Response): Promise<any> => {
  try {
    const articles = await prisma.article.findMany();

    res.status(200).send({
      message: "Articles retrieved successfully",
      success: true,
      result: articles,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Failed to retrieve articles",
      success: false,
    });
  }
};

export const articleDetail = async (
  req: Request,
  res: Response
): Promise<any> => {
  const articleId = parseInt(req.params.id);

  try {
    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });
    if (article) {
      res.status(200).send({
        message: "Article retrieved successfully",
        success: true,
        result: article,
      });
    } else {
      res.status(404).send({
        message: "Article not found",
        success: false,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Failed to retrieve article",
      success: false,
    });
  }
};

export const deleteArticle = async (
  req: Request,
  res: Response
): Promise<any> => {
  const articleId = parseInt(req.params.id);
  try {
    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });
    if (!article) {
      return res.status(404).send({
        message: "Article not found",
        success: false,
      });
    }
    await prisma.article.delete({
      where: { id: articleId },
    });

    res.status(200).send({
      message: "Article deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Failed to delete article",
      success: false,
    });
  }
};
