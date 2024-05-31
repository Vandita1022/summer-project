import { asyncHandler } from "../utils/asynchandler.js";
import { User } from "../models/user.model.js";
import { Project } from "../models/project.model.js";

// Create project and assign "owner" role:
const createProject = asyncHandler(async (req, res) => {
    // from frontend we get userid, projectName and projectDescription
    const { userid, projectName, projectDescription } = req.body

    const user = await User.findById(userid)
    //Model.findById(id) (id can be string or ObjectId) : Method in Mongoose  
    //returns a Mongoose Query object, which, when executed, resolves to the document that matches the given _id.

    if (!user) {
        return res.status(404).json({ msg: "User not found" })
    }

    const newProject = await Project.create(
        {
            name: projectName,
            description: projectDescription,
            members: [
                {
                    userId: userid,
                    role: "owner"
                }
            ]
        }
    )

    user.projectRoles.set(newProject._id.toString(), 'owner')
    await user.save()

    res.status(201).json({ msg: "Project Created Succesfully", project: newProject })
})

// Join project and assign roles
const joinProject = asyncHandler(async (req, res) => {
    // from frontend, we get userid, projectId, and (new) role
    const { userid, projectId, role } = req.body

    const user = await findById(userid)

    if (!user) {
        return res.status(404).json({ msg: "User not found" })
    }

    const project = await Project.findById(projectId)

    if (!project) {
        return res.status(404).json({ msg: "Project not found" })
    }

    if (!['owner', 'editor', 'member'].include(role)) {
        return res.status(404).json({ msg: "Role not found" })
    }

    const memberIndex = project.members.findIndex(member => member.userId.toString() === userid.toString())
    //array.findIndex(testFunction) : method in JS => to find the index of the first element in an array that satisfies a given test function.
    //If no elements pass the test, it returns -1.

    if (memberIndex !== -1) {
        // member already exists: update role
        project.members[memberIndex].role = role
    }
})


export default { createProject, joinProject }

