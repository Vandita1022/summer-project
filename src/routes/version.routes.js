import { Router } from "express";
import versionControllers from "../controllers/version.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js"; // Middleware to verify JWT token


const router = Router();

// Middleware to authenticate requests
router.use(verifyToken);

// Create new version
router.post("/:contentId", versionControllers.createVersion);

// Get version by ID
router.get("/:contentId/:versionId", versionControllers.getVersionById);

// Update version
router.put("/:versionId", versionControllers.updateVersion);

// Delete version
router.delete("/:versionId", versionControllers.deleteVersion);

export default router;
