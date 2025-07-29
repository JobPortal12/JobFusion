import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { 
    applyJob, 
    getApplicants, 
    getAppliedJobs, 
    updateStatus 
} from "../controllers/application.controller.js";

const router = express.Router();

// Route for applying to a job (POST because it's an action)
router.route("/apply/:id").get(isAuthenticated, applyJob);

// Route for getting jobs the user has applied to
router.route("/get").get(isAuthenticated, getAppliedJobs);

// Route for fetching applicants for a specific job (for admin)
router.route("/:id/applicants").get(isAuthenticated, getApplicants);

// Route for updating job application status (POST because it's an update action)
router.route("/status/:id/update").post(isAuthenticated, updateStatus);

export default router;
