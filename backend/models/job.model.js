import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        requirements: {
            type: [String],
            required: true // ✅ Ensuring it always has values
        },
        salary: {
            type: Number,
            required: true
        },
        experience: {
            type: Number,
            required: true
        },
        location: {
            type: String,
            required: true
        },
        jobType: {
            type: String,
            required: true
        },
        position: {
            type: Number,
            required: true
        },
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company", // Ensure "Company" matches your actual model name
            required: true
        },
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Ensure "User" matches your actual model name
            required: true
        },
        applications: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Application" // Ensure "Application" matches your actual model name
            }
        ]
    },
    { timestamps: true }
);

export const Job = mongoose.model("Job", jobSchema);
