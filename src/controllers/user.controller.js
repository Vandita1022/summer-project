import { asyncHandler } from "../utils/asynchandler.js";
import { User } from "../models/user.model.js";

//home logic goes here
const home = asyncHandler(async (req, res) => {
    res
        .status(200)
        .send("Hello from Home Controller")
})

// Register Logic goes here:
// we will send the "body" of the "req" as req.body in postman => body. And send request as "Post"

/* 
User will provide username, email and password
*/
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    //username unique error (400)
    const userExists = await User.findOne({ email })
    if (userExists) {
        return res.status(400).json({ msg: "email already exists" })
    }
    const userCreated = await User.create(
        {
            username,
            email,
            password
        }
    )

    res
        .status(201).json({ msg: "User Created Succesfully", user: userCreated, token: await userCreated.generateToken() })

}) //works

export default { home, registerUser }

