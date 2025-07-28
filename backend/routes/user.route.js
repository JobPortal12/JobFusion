import express from "express"
import { login,logout,register,updateProfile,forgotPassword,resetPassword, updateProfilePic } from "../controllers/user.controller.js"
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();
router.route("/register").post(singleUpload,register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated,singleUpload,updateProfile);
router.route("/forgot").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);
router.route("/update-profile-pic").put(isAuthenticated,singleUpload,updateProfilePic);
export default router;