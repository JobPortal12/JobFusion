import mongoose from "mongoose";

// Define the application schema
const applicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,  // Stores the Job ID
        ref: 'Job',  // Reference to the Job model
        required: true
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,  // Stores the User ID
        ref: 'User',  // Reference to the User model
        required: true
    },
    // Status of the job application (pending, accepted, or rejected)
    status: {
        type: String,
        enum: ['pending', 'rejected', 'accepted'],  // Allowed values
        default: 'pending'  // Default status is "pending"
    }
}, { timestamps: true });  // Automatically adds createdAt and updatedAt fields

// Export the Application model
export const Application = mongoose.model("Application", applicationSchema);
