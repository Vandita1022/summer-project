import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
    {
        projectId: 
        {
            type: Schema.Types.ObjectId,
            ref: 'Project',
            required: true
        },
        userId: 
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        text: 
        {
            type: String,
            required: true
        },
    },
    {
        timestamps:true
    }
)

export const Comment = mongoose.model("Comment", commentSchema)