import { Comment } from "../models/comment.model.js";
import { Project } from "../models/project.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";


const getAllComments = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const userRole = req.user.projectRoles.get(projectId.toString());

    if (!['owner', 'editor', 'member'].includes(userRole)) {
        throw new ApiError(403, "Permission Denied");
    }

    const comments = await Comment.find({ projectId });
    res.status(200).json(new ApiResponse(200, comments, "All Comments Fetched Successfully"));
});

const createComment = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { text } = req.body;
    const userRole = req.user.projectRoles.get(projectId.toString());

    if (!['owner', 'editor', 'member'].includes(userRole)) {
        throw new ApiError(403, "Permission Denied");
    }

    const comment = await Comment.create({ projectId, userId: req.user._id, text });
    
    //  // Update the project document to include the newly created comment
    //  const project = await Project.findById(projectId);
    //  if (!project) {
    //      throw new ApiError(404, "Project not found");
    //  }
 
    //  project.comments.push(comment);
    //  await project.save();
 
     res.status(201).json(new ApiResponse(201, comment, "Comment Created Successfully"));
});

const getCommentById = asyncHandler(async (req, res) => {
    const { projectId, contentId, commentId } = req.params;
    const userRole = req.user.projectRoles.get(projectId.toString());

    if (!['owner', 'editor', 'member'].includes(userRole)) {
        throw new ApiError(403, "Permission Denied");
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    res.status(200).json(new ApiResponse(200, comment, "Comment Fetched Successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
    const { projectId, contentId, commentId } = req.params;
    const { text } = req.body;
    const userRole = req.user.projectRoles.get(projectId.toString());

    if (!['owner', 'editor', 'member'].includes(userRole)) {
        throw new ApiError(403, "Permission Denied");
    }

    const comment = await Comment.findByIdAndUpdate(commentId, { text }, { new: true });
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    res.status(200).json(new ApiResponse(200, comment, "Comment Updated Successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
    const { projectId, contentId, commentId } = req.params;
    const userRole = req.user.projectRoles.get(projectId.toString());

    if (!['owner', 'editor', 'member'].includes(userRole)) {
        throw new ApiError(403, "Permission Denied");
    }

    const comment = await Comment.findByIdAndDelete(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    await Project.findByIdAndUpdate(projectId, {
        $pull: { comments: comment._id }
    });

    res.status(200).json(new ApiResponse(200, {}, "Comment Removed Successfully"));
});

export default { getAllComments, createComment, getCommentById, updateComment, deleteComment };
