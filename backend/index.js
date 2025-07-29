// Importing required modules using ES6 syntax
import express from "express"; // Framework for building server-side applications
import cookieParser from "cookie-parser"; // Middleware to parse cookies
import cors from "cors"; // Middleware to enable Cross-Origin Resource Sharing
import dotenv from "dotenv"; // Load environment variables
import connectDB from "./utils/db.js"; // Database connection function

// Importing route handlers
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";

// Load environment variables
dotenv.config();

// Initialize an Express application
const app = express();

// Middleware: Parse JSON data in incoming requests
app.use(express.json()); 

// Middleware: Parse URL-encoded data in incoming requests (e.g., from forms)
app.use(express.urlencoded({ extended: true })); 

// Middleware: Parse cookies from incoming requests
app.use(cookieParser());

// CORS configuration to allow requests from the specified origin
const corsOptions = {
    origin: "http://localhost:5173", // Allow requests from this origin
    credentials: true, // Allow sending cookies with CORS requests
};

// Middleware: Enable CORS with the specified options
app.use(cors(corsOptions));

// API routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute); 

// Set the port number for the server
const PORT = process.env.PORT || 3000;

// Connect to the database and start the server
connectDB() //it returns an promise 
    .then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Server running at port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("❌ Database connection failed:", error);
        process.exit(1); // Exit process with failure
    });
