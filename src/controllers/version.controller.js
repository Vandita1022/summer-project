import { asyncHandler } from "../utils/asynchandler.js";
import { Version } from "../models/version.model.js";
import { User } from "../models/user.model.js";
import { Content } from "../models/content.model.js";

const createVersion = asyncHandler(async (req, res) => {
    // from frontend: userId, filePath, contentId from params
    const { userId, filePath } = req.body;
    const { contentId } = req.params;

    const content = await Content.findById(contentId);
    if (!content) {
        return res.status(404).json({ msg: "Content not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ msg: "User not found" });
    }

    const userRole = user.projectRoles.get(content.projectId.toString());
    if (userRole !== 'editor' && userRole !== 'owner') {
        return res.status(403).json({ msg: "Permission Denied" });
    }

    const newVersion = await Version.create({
        contentId: contentId,
        uploadedBy: userId,
        filePath: filePath
    });

    content.versions.push(newVersion._id);
    await content.save();

    res.status(201).json({ msg: "Version created successfully", newVersion });
});

const getVersionById = asyncHandler(async (req, res) => {
    const { versionId } = req.params;
    const { userId } = req.body;

    const version = await Version.findById(versionId);
    if (!version) {
        return res.status(404).json({ msg: "Version not found" });
    }

    const content = await Content.findById(version.contentId);
    if (!content) {
        return res.status(404).json({ msg: "Content not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ msg: "User not found" });
    }

    const userRole = user.projectRoles.get(content.projectId.toString());
    if (userRole !== 'owner' && userRole !== 'editor' && userRole !== 'member') {
        return res.status(403).json({ msg: "Permission Denied" });
    }

    res.status(200).json(version);
});

const updateVersion = asyncHandler(async (req, res) => {
    const { versionId } = req.params;
    const { userId, filePath } = req.body;

    const version = await Version.findById(versionId);
    if (!version) {
        return res.status(404).json({ msg: "Version not found" });
    }

    const content = await Content.findById(version.contentId);
    if (!content) {
        return res.status(404).json({ msg: "Content not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ msg: "User not found" });
    }

    const userRole = user.projectRoles.get(content.projectId.toString());
    if (userRole !== 'owner' && userRole !== 'editor') {
        return res.status(403).json({ msg: "Permission Denied" });
    }

    version.uploadedBy = userId;
    version.filePath = filePath;
    await version.save();

    res.status(200).json({ msg: "Version updated successfully", version });
});

const deleteVersion = asyncHandler(async (req, res) => {
    const { versionId } = req.params;
    const { userId } = req.body;

    const version = await Version.findById(versionId);
    if (!version) {
        return res.status(404).json({ msg: "Version not found" });
    }

    const content = await Content.findById(version.contentId);
    if (!content) {
        return res.status(404).json({ msg: "Content not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ msg: "User not found" });
    }

    const userRole = user.projectRoles.get(content.projectId.toString());
    if (userRole !== 'owner') {
        return res.status(403).json({ msg: "Permission Denied" });
    }

    await version.remove();
    res.status(200).json({ msg: "Version removed successfully" });
});

export default {
    createVersion,
    getVersionById,
    updateVersion,
    deleteVersion
};
