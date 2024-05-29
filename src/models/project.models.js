import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema(
    {
        name:
        {
            type: String,
            required: true
        },
        description:
        {
            type: String,
            required: true
        },
        members:
        [
            {
                userId:
                {
                    type: Schema.Types.ObjectId,
                    ref: 'User'
                },
                role:
                {
                    type: String,
                    enum: ['owner', 'editor', 'member'],
                    required: true
                }
            }
        ],
        isReleased:
        {
            type:Boolean
        }
    },
    {
        timestamps: true
    }
);

export const Project = mongoose.model("Project", projectSchema);