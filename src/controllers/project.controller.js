import { asyncHandler } from "../utils/asynchandler.js";
import { User } from "../models/user.model.js";
import { Project } from "../models/project.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Create project and assign "owner" role
const createProject = asyncHandler(async (req, res) => {
    const { projectName, projectDescription } = req.body;
    const userId = req.user._id;

    const newProject = await Project.create({
        name: projectName,
        description: projectDescription,
        members: [
            {
                userId: userId,
                role: "owner"
            }
        ]
    });

    req.user.projectRoles.set(newProject._id.toString(), 'owner');
    await req.user.save();

    res.status(201).json(new ApiResponse(201, { project: newProject }, "Project Created Successfully"));
});

// Join project and assign roles
const joinProject = asyncHandler(async (req, res) => {
    const { projectId, role } = req.body;
    const userId = req.user._id;

    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    if (!['owner', 'editor', 'member'].includes(role)) {
        throw new ApiError(400, "Invalid role");
    }

    const memberIndex = project.members.findIndex(member => member.userId.toString() === userId.toString());

    req.user.projectRoles.set(project._id.toString(), role);

    if (memberIndex !== -1) {
        project.members[memberIndex].role = role;
    } else {
        project.members.push({ userId, role });
    }

    await req.user.save();
    await project.save();

    res.status(200).json(new ApiResponse(200, { project }, "User added and updated in project successfully"));
});

// Get project by project ID
const getProjectById = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    res.status(200).json(new ApiResponse(200, project, "Project fetched successfully"));
});

// Update project
const updateProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { name, description } = req.body;

    const userRole = req.user.projectRoles.get(projectId.toString());
    if (userRole !== 'owner') {
        throw new ApiError(403, "Permission Denied");
    }

    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    project.name = name || project.name;
    project.description = description || project.description;

    await project.save();

    res.status(200).json(new ApiResponse(200, { project }, "Project updated successfully"));
});

// Delete project
const deleteProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const userRole = req.user.projectRoles.get(projectId.toString());
    if (userRole !== 'owner') {
        throw new ApiError(403, "Permission Denied");
    }

    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    await project.remove();

    res.status(200).json(new ApiResponse(200, {}, "Project deleted successfully"));
});

// Get all projects with pagination and aggregation
const getAllProjects = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.user._id;

    const projects = await Project.aggregate([
        {
            $match: { "members.userId": userId }
        },
        {
            $lookup: {
                from: "users",
                localField: "members.userId",
                foreignField: "_id",
                as: "memberDetails"
            }
        },
        {
            $unwind: "$memberDetails"
        },
        {
            $group: {
                _id: "$_id",
                name: { $first: "$name" },
                description: { $first: "$description" },
                members: { $push: "$members" },
                memberDetails: { $push: "$memberDetails" }
            }
        },
        {
            $skip: (page - 1) * limit
        },
        {
            $limit: parseInt(limit)
        }
    ]);

    const totalProjects = await Project.countDocuments({ "members.userId": userId });
    const totalPages = Math.ceil(totalProjects / limit);

    res.status(200).json(new ApiResponse(200, { projects, page: parseInt(page), totalPages, totalProjects }, "Projects fetched successfully"));
});

export default { createProject, joinProject, getProjectById, updateProject, deleteProject, getAllProjects };
