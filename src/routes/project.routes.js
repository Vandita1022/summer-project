import { Router } from "express";
import projectController from "../controllers/project.controller.js";
import { asyncHandler } from "../utils/asynchandler.js";

const router = Router();

// Route to create a project
router.route("/create").post(projectController.createProject);

// Route to join a project
router.route("/join").post(projectController.joinProject);

export default router;