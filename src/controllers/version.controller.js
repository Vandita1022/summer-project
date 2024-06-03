import { asyncHandler } from "../utils/asynchandler.js";
import { Version } from "../models/version.model.js";
import { Content } from "../models/content.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createVersion = asyncHandler(async (req, res) => {
    const { filePath } = req.body;
    const { contentId } = req.params;
    const userId = req.user._id;

    const content = await Content.findById(contentId);
    if (!content) {
        throw new ApiError(404, "Content not found");
    }

    const userRole = req.user.projectRoles.get(content.projectId.toString());
    if (userRole !== 'editor' && userRole !== 'owner') {
        throw new ApiError(403, "Permission Denied");
    }

    const newVersion = await Version.create({
        contentId: contentId,
        uploadedBy: userId,
        filePath: filePath
    });

    content.versions.push(newVersion._id);
    await content.save();

    res.status(201).json(new ApiResponse(201, { newVersion }, "Version created successfully"));
});

const getVersionById = asyncHandler(async (req, res) => {
    const { versionId } = req.params;
    const { contentId } = req.params;

    const version = await Version.findById(versionId);
    if (!version) {
        throw new ApiError(404, "Version not found");
    }

    const content = await Content.findById(contentId);
    if (!content) {
        throw new ApiError(404, "Content not found");
    }

    const userRole = req.user.projectRoles.get(content.projectId.toString());
    if (!['owner', 'editor', 'member'].includes(userRole)) {
        throw new ApiError(403, "Permission Denied");
    }

    res.status(200).json(new ApiResponse(200, version, "Version fetched successfully"));
});

const updateVersion = asyncHandler(async (req, res) => {
    const { versionId } = req.params;
    const { filePath } = req.body;
    const userId = req.user._id;

    const version = await Version.findById(versionId);
    if (!version) {
        throw new ApiError(404, "Version not found");
    }

    const content = await Content.findById(version.contentId);
    if (!content) {
        throw new ApiError(404, "Content not found");
    }

    const userRole = req.user.projectRoles.get(content.projectId.toString());
    if (userRole !== 'owner' && userRole !== 'editor') {
        throw new ApiError(403, "Permission Denied");
    }

    version.uploadedBy = userId;
    version.filePath = filePath;
    await version.save();

    res.status(200).json(new ApiResponse(200, { version }, "Version updated successfully"));
});

const deleteVersion = asyncHandler(async (req, res) => {
    const { versionId } = req.params;

    const version = await Version.findById(versionId);
    if (!version) {
        throw new ApiError(404, "Version not found");
    }

    const content = await Content.findById(version.contentId);
    if (!content) {
        throw new ApiError(404, "Content not found");
    }

    const userRole = req.user.projectRoles.get(content.projectId.toString());
    if (userRole !== 'owner') {
        throw new ApiError(403, "Permission Denied");
    }

    await version.remove();
    res.status(200).json(new ApiResponse(200, {}, "Version removed successfully"));
});

export default {
    createVersion,
    getVersionById,
    updateVersion,
    deleteVersion
};
