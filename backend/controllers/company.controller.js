import { company as Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js"
import cloudinary from "../utils/cloudinary.js"

//Business Logic
export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }
        let existingCompany = await Company.findOne({ name: companyName });

        if (existingCompany) {
            return res.status(400).json({
                message: "You can't register the same company",
                success: false
            });
        }

        const newCompany = await Company.create({
            name: companyName,
            userId: req.id
        });

        return res.status(201).json({
            message: "Company registered successfully",
            company: newCompany,
            success: true
        });
    } catch (error) {
        console.error("Error registering company:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

export const getCompany = async (req, res) => {
    try {
        const userId = req.id;
        const companies = await Company.find({ userId });

        if (!companies || companies.length === 0) {
            return res.status(404).json({
                message: "No companies found",
                success: false
            });
        }

        return res.status(200).json({
            companies,
            success: true
        });
    } catch (error) {
        console.error("Error fetching companies:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

// Get company by ID
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const foundCompany = await Company.findById(companyId);

        if (!foundCompany) {
            return res.status(404).json({
                message: "Company not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Company found successfully",
            company: foundCompany,
            success: true
        });
    } catch (error) {
        console.error("Error fetching company by ID:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;
        const file = req.file;
        const fileUri = getDataUri(file)
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content)
        const logo = cloudResponse.secure_url;      
        const updateData = { name, description, website, location, logo };
        const updatedCompany = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!updatedCompany) {
            return res.status(404).json({
                message: "Company not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Company information updated successfully",
            company: updatedCompany,
            success: true
        });
    } catch (error) {
        console.error("Error updating company:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};