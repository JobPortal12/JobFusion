import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

// Function to apply for a job
export const applyJob = async (req, res) => {
    try {
        const userId = req.id;  // Get user ID from request (user who is applying)
        const jobId = req.params.id;  // Get job ID from request parameters

        // If job ID is missing, return an error
        if (!jobId) {
            return res.status(400).json({
                message: "Job ID is required",
                success: false
            });
        }
        const job = await Job.findById(jobId);
      //  console.log("printing the job obj ->",job);
        // Check if the user has already applied for this job
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });
        if (existingApplication) {
            return res.status(400).json({
                message: "Already applied",
                success: false
            });
        }

        // Check if the job exists in the database
       // const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }

        // Create a new job application entry in the database
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId,
        });

        // Add the new application ID to the job's list of applications
        
        
        job.applications.push(newApplication._id);
        console.log("Printing the job obj again",job);
        
        await job.save();  // Save the updated job document

        return res.status(201).json({
            message: "Job applied successfully",
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

// Function to get all jobs applied by the user
export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;  // Get user ID from request
        // Find all applications where the user is the applicant
        const applications = await Application.find({ applicant: userId })
            .sort({ createdAt: -1 })  // Sort applications by newest first
            .populate({  // Fetch job details along with the application
                path: "job",
                populate: { path: "company" }  // Also fetch company details
            });

        // If no applications found, return an error
        if (!applications || applications.length === 0) {
            return res.status(404).json({
                message: "No applications found",
                success: false
            });
        }

        // Return the list of applications
        return res.status(200).json({
            applications,
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

// Function for the admin to check how many users have applied for a job
export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;  // Get job ID from request parameters
           // console.log("printing the params",req.params);
            
        // Find the job and get all applications related to it
        const job = await Job.findById(jobId).populate({
            path: 'applications',
            options: { sort: { createdAt: -1 } },  // Sort applications by newest first
            populate: { path: 'applicant' }  // Fetch details of the applicants
        });
        //console.log("printing the job",job);
        
        // If the job does not exist, return an error
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }

        // Return the job with all applicants
        return res.status(200).json({
            job,
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

// Function to update the status of a job application (e.g., "accepted", "rejected")
export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;  // Get status from request body
        const applicationId = req.params.id;  // Get application ID from request parameters

        // If no status is provided, return an error
        if (!status) {
            return res.status(400).json({
                message: "Status is required",
                success: false
            });
        }

        // Find the application by its ID
        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(404).json({
                message: "Application not found",
                success: false
            });
        }

        // Update the status of the application
        application.status = status.toLowerCase();  // Convert status to lowercase for consistency
        await application.save();  // Save the updated application status

        return res.status(200).json({
            message: "Status updated successfully",
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};
