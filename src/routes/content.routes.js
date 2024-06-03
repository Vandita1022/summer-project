import { Router } from "express";
import contentControllers from "../controllers/content.controller.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { verifyToken } from "../middlewares/auth.middleware.js"; // Assuming you have an authentication middleware

const router = Router();

// Route to get all content for a project
router.route("/:projectId").get(verifyToken, asyncHandler(contentControllers.getAllContent));

// Route to create content for a project
router.route("/:projectId").post(verifyToken, asyncHandler(contentControllers.createContent));

// Route to get content by ID
router.route("/:projectId/:contentId").get(verifyToken, asyncHandler(contentControllers.getContentById));

// Route to update content by ID
router.route("/:projectId/:contentId").put(verifyToken, asyncHandler(contentControllers.updateContent));

// Route to delete content by ID
router.route("/:projectId/:contentId").delete(verifyToken, asyncHandler(contentControllers.deleteContent));

export default router;
