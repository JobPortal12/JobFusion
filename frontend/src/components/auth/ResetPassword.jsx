import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../shared/Navbar";
import Footer from "../shared/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { USER_API_END_POINT } from "@/utils/constant";
import { motion } from "framer-motion";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword) {
      toast.error("Please enter a new password.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${USER_API_END_POINT}/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Password reset successfully! Please login.");
        navigate("/login");
      } else {
        toast.error(data.message || "Reset failed.");
      }
    } catch (error) {
      console.error("Reset Error:", error);
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-grow flex justify-center items-center px-4 py-10">
        <motion.form
          onSubmit={handleResetPassword}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl"
        >
          <h1 className="text-2xl font-bold text-center mb-6 text-[#6A38C2]">
            Reset Password
          </h1>

          <div className="mb-4">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
          </div>

          {loading ? (
            <Button className="w-full" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Resetting...
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full bg-[#6A38C2] hover:bg-[#5b30a6] text-white"
            >
              Reset Password
            </Button>
          )}
        </motion.form>
      </div>

      <Footer />
    </div>
  );
}
