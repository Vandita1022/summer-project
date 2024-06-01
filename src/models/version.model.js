import mongoose, { Schema } from "mongoose";

const versionSchema = new Schema(
    {
        contentId:
        {
            type: Schema.Types.ObjectId,
            ref: 'Content',
            required: true
        },
        uploadedBy:
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        filePath:
        {
            type: String,
            required: true
        },
        // approved: 
        // {
        //     type: Boolean
        // },
    },
    {
        timestamps: true
    }
);

export const Version = mongoose.model("Version", versionSchema) 