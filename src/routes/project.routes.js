import { Router } from "express";
import projectControllers from "../controllers/project.controller.js";
import { asyncHandler } from "../utils/asynchandler.js";

//route import:
import contentRouter from "./content.routes.js"

const router = Router();

// Route to create a project
router.route("/create").post(projectControllers.createProject);

// Route to join a project
router.route("/join").post(projectControllers.joinProject).get(asyncHandler(async (req, res) => {
    res
        .status(200)
        .send("Hello from Join Project Controller")
}))

// get project by project ID
// update a project
// delete a project

// content routes mount: .use() method
router.use("/:projectId/content", contentRouter)

export default router;