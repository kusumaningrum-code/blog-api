import dotenv from "dotenv";
import express, { Application, Response, Request, NextFunction } from "express";
import cors from "cors";
dotenv.config();
import userRouter from "./routers/userRouter";
import followerRouter from "./routers/followerRouter";
import articleRouter from "./routers/articleRouter";
import { prisma } from "./config/prisma";
import responseHandler from "./utils/responseHandler";

const PORT = process.env.PORT;
const app: Application = express();
app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response): any => {
  return res.status(200).send("<h1>ORM API<h1>");
});

app.use("/user", userRouter, followerRouter, articleRouter);

//error handling
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  responseHandler.error(res, error.message, error.error, error.rc);
});
app.listen(PORT, () => {
  console.log("API RUNNING", PORT);
});
// //regis
// app.post("/register", async (req: Request, res: Response): Promise<any> => {
//   try {
//     const user = await prisma.user.create({
//       data: req.body,
//     });

//     res.status(201).send({
//       message: "User registered successfully",
//       success: true,
//       result: user,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       message: "Registration failed",
//       success: false,
//     });
//   }
// });

// //login
// app.post("/login", async (req: Request, res: Response): Promise<any> => {
//   try {
//     const { email, password } = req.body;

//     const user = await prisma.user.findUnique({
//       where: {
//         email,
//       },
//     });

//     if (!user) {
//       return res.status(404).send({
//         message: "User not found",
//         success: false,
//       });
//     }
//     if (user.password === password) {
//       return res.status(200).send({
//         message: "Login successful",
//         success: true,
//         result: { id: user.id, username: user.username, email: user.email },
//       });
//     } else {
//       return res.status(401).send({
//         message: "Invalid password",
//         success: false,
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       message: "Login failed",
//       success: false,
//     });
//   }
// });

// //create article
// app.post("/articles", async (req: Request, res: Response): Promise<any> => {
//   try {
//     const { title, content } = req.body;

//     if (!title || !content) {
//       return res.status(400).send({
//         message: "Missing required fields: title or content",
//         success: false,
//       });
//     }
//     const article = await prisma.article.create({
//       data: {
//         title,
//         content,
//       },
//     });

//     res.status(201).send({
//       message: "Article created successfully",
//       success: true,
//       result: article,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({
//       message: "Failed to create article",
//       success: false,
//     });
//   }
// });

// //update articles
// app.patch(
//   "/articles/:id",
//   async (req: Request, res: Response): Promise<any> => {
//     try {
//       const { id } = req.params;
//       const { title, content } = req.body;

//       const updateData: any = {};
//       if (title) updateData.title = title;
//       if (content) updateData.content = content;

//       if (Object.keys(updateData).length === 0) {
//         return res.status(400).send({
//           message: "Missing required fields: title or content",
//           success: false,
//         });
//       }
//       const updatedArticle = await prisma.article.update({
//         where: {
//           id: parseInt(id),
//         },
//         data: updateData,
//       });

//       res.status(200).send({
//         message: "Article updated successfully",
//         success: true,
//         result: updatedArticle,
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).send({
//         message: "Failed to update article",
//         success: false,
//       });
//     }
//   }
// );

// //get articles
// app.get("/articles", async (req: Request, res: Response): Promise<any> => {
//   try {
//     const articles = await prisma.article.findMany();

//     res.status(200).send({
//       message: "Articles retrieved successfully",
//       success: true,
//       result: articles,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({
//       message: "Failed to retrieve articles",
//       success: false,
//     });
//   }
// });

// //get article details
// app.get("/articles/:id", async (req: Request, res: Response): Promise<any> => {
//   const articleId = parseInt(req.params.id);

//   try {
//     const article = await prisma.article.findUnique({
//       where: { id: articleId },
//     });
//     if (article) {
//       res.status(200).send({
//         message: "Article retrieved successfully",
//         success: true,
//         result: article,
//       });
//     } else {
//       res.status(404).send({
//         message: "Article not found",
//         success: false,
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({
//       message: "Failed to retrieve article",
//       success: false,
//     });
//   }
// });

// //delete article
// app.delete(
//   "/articles/:id",
//   async (req: Request, res: Response): Promise<any> => {
//     const articleId = parseInt(req.params.id);
//     try {
//       const article = await prisma.article.findUnique({
//         where: { id: articleId },
//       });
//       if (!article) {
//         return res.status(404).send({
//           message: "Article not found",
//           success: false,
//         });
//       }
//       await prisma.article.delete({
//         where: { id: articleId },
//       });

//       res.status(200).send({
//         message: "Article deleted successfully",
//         success: true,
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).send({
//         message: "Failed to delete article",
//         success: false,
//       });
//     }
//   }
// );
