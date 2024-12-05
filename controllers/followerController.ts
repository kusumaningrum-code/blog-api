import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export const createFollow = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { followerId, followingId } = req.body;
    if (!followerId || !followingId) {
      return res.status(400).send({
        message: "Missing required fields: followerId or followingId",
        success: false,
      });
    }

    const follow = await prisma.follow.create({
      data: req.body,
    });

    res.status(201).send({
      message: "Follow relationship created successfully",
      success: true,
      result: follow,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Failed to create follow relationship",
      success: false,
    });
  }
};
export const getFollowers = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userId = parseInt(req.params.userId);

  try {
    const followers = await prisma.follow.findMany({
      where: { followingId: userId },
      include: { follower: true },
    });

    res.status(200).send({
      message: "Followers retrieved successfully",
      success: true,
      result: followers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Failed to retrieve followers",
      success: false,
    });
  }
};
export const getFollowing = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userId = parseInt(req.params.userId);

  try {
    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      include: { following: true },
    });

    res.status(200).send({
      message: "Following list retrieved successfully",
      success: true,
      result: following,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Failed to retrieve following list",
      success: false,
    });
  }
};

export const deleteFollow = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { followerId, followingId } = req.params;

  try {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: parseInt(followerId),
          followingId: parseInt(followingId),
        },
      },
    });

    if (!follow) {
      return res.status(404).send({
        message: "Follow relationship not found",
        success: false,
      });
    }

    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: parseInt(followerId),
          followingId: parseInt(followingId),
        },
      },
    });

    res.status(200).send({
      message: "Follow relationship deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Failed to delete follow relationship",
      success: false,
    });
  }
};
