import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//imports
//bcrypt, jwt

const userSchema = new Schema(
    {
        username:
        {
            type: String,
            unique: true,
            required: true
        },
        email:
        {
            type: String,
            required: true,
            unique: true
        },
        password:
        {
            type: String,
            required: true
        },
        // Map to store project roles
        projectRoles:
        {
            type: Map,
            of:
            {
                type: String,
                enum: ['owner', 'editor', 'member']
            },
            default: {}
        },
        // Assign the role to the project in the user's projectRoles map:
        //user.projectRoles.set(projectId, role);
    },
    {
        timestamps: true
    }
);

// middlewares
// securing password before sending to database
userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) {
        next()
    }

    try {
        const saltRound = await bcrypt.genSalt(10)
        const hashed_password = await bcrypt.hash(this.password, saltRound)
        this.password = hashed_password
    } catch (error) {
        next(error)
    }
})

// methods
// JSON Web Token
userSchema.methods.generateToken = async function () {
    try {
        return jwt.sign(
            {
                userId : this._id.toString(),
                email  : this.email,
            }
        )
    } catch (error) {
        console.error(error)
    }
}

export const User = mongoose.model("User", userSchema)