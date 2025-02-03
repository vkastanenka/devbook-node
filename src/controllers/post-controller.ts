// utils
import prisma from "../lib/db";

import { crudFactory } from "../lib/utils/crud-factory";

// types
import { Request, Response, NextFunction } from "express";

// Tests posts route
const postTest = (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Posts route secured" });
  return;
};

// Comment
const postCreateComment = crudFactory.createRecord(prisma.comment);
const postReadComment = crudFactory.readRecord(prisma.comment);
const postReadAllComments = crudFactory.readAllRecords(prisma.comment);
const postUpdateComment = crudFactory.updateRecord(prisma.comment);
const postDeleteComment = crudFactory.deleteRecord(prisma.comment);

// Post
const postCreatePost = crudFactory.createRecord(prisma.post);
const postReadPost = crudFactory.readRecord(prisma.post);
const postReadAllPosts = crudFactory.readAllRecords(prisma.post);
const postUpdatePost = crudFactory.updateRecord(prisma.post);
const postDeletePost = crudFactory.deleteRecord(prisma.post);

// PostLike
const postCreatePostLike = crudFactory.createRecord(prisma.postLike);
const postReadPostLike = crudFactory.readRecord(prisma.postLike);
const postReadAllPostLikes = crudFactory.readAllRecords(prisma.postLike);
const postUpdatePostLike = crudFactory.updateRecord(prisma.postLike);
const postDeletePostLike = crudFactory.deleteRecord(prisma.postLike);

export const postController = {
  postTest,
  postCreateComment,
  postReadComment,
  postReadAllComments,
  postUpdateComment,
  postDeleteComment,
  postCreatePost,
  postReadPost,
  postReadAllPosts,
  postUpdatePost,
  postDeletePost,
  postCreatePostLike,
  postReadPostLike,
  postReadAllPostLikes,
  postUpdatePostLike,
  postDeletePostLike,
};
