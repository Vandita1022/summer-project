import mongoose, { Schema } from "mongoose";

const contentSchema = new Schema(
    {
        projectId: 
        {
            type: Schema.Types.ObjectId,
            ref: 'Project',
            required: true
        },
        type: 
        {
            type: String,
            required: true
        },
        versions:
        [
            {
                type: Schema.Types.ObjectId,
                ref:'Version'
            }
        ]
    },
    {
        timestamps:true
    }
)

export const Content = mongoose.model("Content", contentSchema);