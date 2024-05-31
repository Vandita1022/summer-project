import { Router } from "express";
import { asyncHandler } from "../utils/asynchandler.js";
import versionControllers from "../controllers/version.controller.js";

const router = Router({ mergeParams: true });
//allows the child router to access parameters defined in the parent router.

router.post("/", versionControllers.createVersion);
router.get("/:versionId", versionControllers.getVersionById);
router.put("/:versionId", versionControllers.updateVersion);
router.delete("/:versionId", versionControllers.deleteVersion);

export default router;