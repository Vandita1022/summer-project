import { Content } from "../models/content.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asynchandler.js";

const getAllContent = asyncHandler(async (req, res) => {
    const { userId } = req.body

    const user = await User.findById(userId)
    if (!user) {
        return res.status(404).json({ msg: "User not found" })
    }
    const userRole = user.projectRoles.get(projectId.toString())
    if (userRole !== 'owner' && userRole !== 'editor' && userRole !== 'member') {
        return res.status(403).json({ msg: "Permission Denied" })
    }

    const content = await Content.find()
    if (!content) {
        res.status(404).json({ msg: "Content not found" })
    }
    res.status(200).json(content)
})
const createContent = asyncHandler(async (req, res) => {
    // from frontend type, from params : projectId 
    // somewhat like: image, video etc

    const { projectId } = req.params
    const { userId, type } = req.body

    const user = await User.findById(userId)
    if (!user) {
        return res.status(404).json({ msg: "User not found" })
    }
    const userRole = user.projectRoles.get(projectId.toString())
    if (userRole !== 'owner' && userRole !== 'editor') {
        return res.status(403).json({ msg: "Permission Denied" })
    }

    const content = await Content.create(
        {
            projectId: projectId,
            type: type
        }
    )

    res.status(201).json({ msg: "Content Created Succesfully", content })
}) //works
const getContentById = asyncHandler(async (req, res) => {
    // contentId from params
    const { userId } = req.body
    const { contentId } = req.params
    const user = await User.findById(userId)
    if (!user) {
        return res.status(404).json({ msg: "User not found" })
    }
    const userRole = user.projectRoles.get(projectId.toString())
    if (userRole !== 'owner' && userRole !== 'editor' && userRole !== 'member') {
        return res.status(403).json({ msg: "Permission Denied" })
    }
    const content = await Content.findById(contentId)
    if (!content) {
        res.status(404).json({ msg: "Content not found" })
    }

    res.status(200).json(content)
})
const updateContent = asyncHandler(async (req, res) => {
    const { contentId } = req.params
    // not gonna change project
    const { userId, type } = req.body
    const user = await User.findById(userId)
    if (!user) {
        return res.status(404).json({ msg: "User not found" })
    }
    const userRole = user.projectRoles.get(projectId.toString())
    if (userRole !== 'owner') {
        return res.status(403).json({ msg: "Permission Denied" })
    }
    const content = await Content.findById(contentId)
    if (!content) {
        res.status(404).json({ msg: "Content not found" })
    }

    content.type = type
    await content.save()
    res.status(200).json({ msg: "Content updated succesfully", content })
})
const deleteContent = asyncHandler(async (req, res) => {
    const { contentId } = req.params
    const { userId } = req.body

    const user = await User.findById(userId)
    if (!user) {
        return res.status(404).json({ msg: "User not found" })
    }
    const userRole = user.projectRoles.get(projectId.toString())
    if (userRole !== 'owner') {
        return res.status(403).json({ msg: "Permission Denied" })
    }
    const content = await Content.findById(contentId)
    if (!content) {
        res.status(404).json({ msg: "Content not found" })
    }

    await content.remove()
    res.status(200).json({ msg: "Content removed succesfully" })
})

export default { getAllContent, createContent, getContentById, updateContent, deleteContent }
