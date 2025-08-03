import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import Footer from "../shared/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import axios from "axios";
import { motion } from "framer-motion";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${USER_API_END_POINT}/forgot`,
        { email },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Reset link sent! Check your email.");
        setEmail("");
      } else {
        toast.error(response.data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error(error.response?.data?.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-grow flex justify-center items-center px-4 py-10">
        <motion.form
          onSubmit={handleForgotPassword}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl"
        >
          <h2 className="text-2xl font-bold text-center mb-4 text-[#6A38C2]">
            Forgot Password
          </h2>
          <p className="text-sm text-gray-600 text-center mb-6">
            Enter your email to receive a password reset link.
          </p>

          <div className="relative mb-4">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="email"
              placeholder="Enter your email"
              className="pl-10 w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#6A38C2] hover:bg-[#5b30a6] text-white"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </motion.form>
      </div>

      <Footer />
    </div>
  );
}
