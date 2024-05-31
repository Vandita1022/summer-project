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
    const { userId, projectId, role } = req.body

    const user = await User.findById(userId)

    if (!user) {
        return res.status(404).json({ msg: "User not found" })
    }

    const project = await Project.findById(projectId)

    if (!project) {
        return res.status(404).json({ msg: "Project not found" })
    }

    if (!['owner', 'editor', 'member'].includes(role)) {
        return res.status(404).json({ msg: "Role not found" })
    }

    const memberIndex = project.members.findIndex(member => member.userId.toString() === userId.toString())
    console.log(`\n${memberIndex}`)
    //array.findIndex(testFunction) : method in JS => to find the index of the first element in an array that satisfies a given test function.
    //If no elements pass the test, it returns -1.


    user.projectRoles.set(project._id.toString(), role)

    if (memberIndex !== -1) {
        // member already exists: update role
        project.members[memberIndex].role = role
    }

    else {
        // Add new member if user is not already a member
        project.members.push({ userId, role });
    }

    await user.save()
    await project.save()

    res.status(200).json({ msg: "User added/updated in project successfully", project });
})


export default { createProject, joinProject }

