//project.routes need to be updated
//import commentRouter from "./comment.routes.js";
////Mount comment routes
//router.use("/:projectId/comment", verifyToken, commentRouter)


import { Router } from "express";
import commentControllers from "../controllers/comment.controller.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router({ mergeParams: true });

// Route to get all comments for a project
router.get("/", verifyToken, asyncHandler(commentControllers.getAllComments));

// Route to create a new comment
router.post("/", verifyToken, asyncHandler(commentControllers.createComment));

// Route to get a comment by ID
router.get("/:commentId", verifyToken, asyncHandler(commentControllers.getCommentById));

// Route to update a comment by ID
router.put("/:commentId", verifyToken, asyncHandler(commentControllers.updateComment));

// Route to delete a comment by ID
router.delete("/:commentId", verifyToken, asyncHandler(commentControllers.deleteComment));

export default router;
