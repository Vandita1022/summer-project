import { Content } from "../models/content.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";

const getAllContent = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const userRole = req.user.projectRoles.get(projectId.toString());

    if (!['owner', 'editor', 'member'].includes(userRole)) {
        throw new ApiError(403, "Permission Denied");
    }

    const content = await Content.find({ projectId });
    res.status(200).json(new ApiResponse(200, content, "All Content Fetched Successfully"));
});

const createContent = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { type } = req.body;
    const userRole = req.user.projectRoles.get(projectId.toString());

    if (userRole !== 'owner' && userRole !== 'editor') {
        throw new ApiError(403, "Permission Denied");
    }

    const content = await Content.create({ projectId, type });
    res.status(201).json(new ApiResponse(201, content, "Content Created Successfully"));
});

const getContentById = asyncHandler(async (req, res) => {
    const { contentId, projectId } = req.params;
    const userRole = req.user.projectRoles.get(projectId.toString());

    if (!['owner', 'editor', 'member'].includes(userRole)) {
        throw new ApiError(403, "Permission Denied");
    }

    const content = await Content.findById(contentId);
    if (!content) {
        throw new ApiError(404, "Content not found");
    }

    res.status(200).json(new ApiResponse(200, content, "Content Fetched Successfully"));
});

const updateContent = asyncHandler(async (req, res) => {
    const { contentId, projectId } = req.params;
    const { type } = req.body;
    const userRole = req.user.projectRoles.get(projectId.toString());

    if (userRole !== 'owner') {
        throw new ApiError(403, "Permission Denied");
    }

    const content = await Content.findByIdAndUpdate(contentId, { type }, { new: true });
    if (!content) {
        throw new ApiError(404, "Content not found");
    }

    res.status(200).json(new ApiResponse(200, content, "Content Updated Successfully"));
});

const deleteContent = asyncHandler(async (req, res) => {
    const { contentId, projectId } = req.params;
    const userRole = req.user.projectRoles.get(projectId.toString());

    if (userRole !== 'owner') {
        throw new ApiError(403, "Permission Denied");
    }

    const content = await Content.findByIdAndRemove(contentId);
    if (!content) {
        throw new ApiError(404, "Content not found");
    }

    res.status(200).json(new ApiResponse(200, {}, "Content Removed Successfully"));
});

export default { getAllContent, createContent, getContentById, updateContent, deleteContent };
