import { asyncHandler } from "../utils/asynchandler.js";
import { Version } from "../models/version.model.js";
import { Content } from "../models/content.model.js";

const createVersion = asyncHandler(async (req, res) => {
    // from frontend: userId, filePath, contentId from params
    const { userId, filePath } = req.body

    const { contentId } = req.params

    const content = await Content.findById(contentId)

    //errors:
    if (!content) {
        res.status(404).json({ msg: "Content not found" })
    }

    const newVersion = await Version.create(
        {
            uploadedBy: userId,
            filePath: filePath
        }
    )

    content.versions.push(newVersion._id)

    await content.save()

    res.status(201).json({ msg: "Version created succesfully", newVersion })
}); // works
const getVersionById = asyncHandler(async (req, res) => {
    // from params : versionId
    const { versionId } = req.params

    const version = await Version.findById(versionId)

    if (!version) {
        return res.status(404).json({ msg: "Version not found" })
    }

    res.status(200).json(version)
});
const updateVersion = asyncHandler(async (req, res) => {
    // from params
    const { versionId } = req.params
    // from frontend
    const { userId, filePath } = req.body

    const version = await Version.findById(versionId)
    if (!version) {
        return res.status(404).json({ msg: "Version not found" })
    }

    version.uploadedBy = userId
    version.filePath = filePath

    await version.save()

    res.status(200).json({ msg: "Version Updated Succesfully", version })
});
const deleteVersion = asyncHandler(async (req, res) => {
    // from params
    const { versionId } = req.params
    const version = await Version.findById(versionId)

    if (!version) {
        res.status(404).json({ msg: "Version not found" })
    }

    await version.remove()
    res.status(200).json({ msg: "Version Removed Succesfully" })
});

export default {
    createVersion,
    getVersionById,
    updateVersion,
    deleteVersion
}