import mongoose, { Schema } from "mongoose";

const versionSchema = new Schema(
    {
        uploadedBy: 
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        file_path: 
        {
            type: String,
            required: true
        },
        approved: 
        {
            type: Boolean,
        }
    },
    {
        timestamps:true
    }
)

export const Version = mongoose.model("Version", versionSchema) 