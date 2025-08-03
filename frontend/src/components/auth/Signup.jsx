import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../shared/Navbar";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { setLoading } from "@/redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Signup() {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: "",
  });

  const { loading, user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);
    if (input.file) formData.append("file", input.file);

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) navigate("/");
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex justify-center items-center px-4 py-10">
        <motion.form
          onSubmit={submitHandler}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md"
        >
          <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>

          <div className="mb-4">
            <Label>Full Name</Label>
            <Input
              type="text"
              name="fullname"
              value={input.fullname}
              onChange={changeEventHandler}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="mb-4">
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              placeholder="example@email.com"
              required
            />
          </div>

          <div className="mb-4">
            <Label>Phone Number</Label>
            <Input
              type="text"
              name="phoneNumber"
              value={input.phoneNumber}
              onChange={changeEventHandler}
              placeholder="1234567890"
              required
            />
          </div>

          <div className="mb-4">
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              value={input.password}
              onChange={changeEventHandler}
              placeholder="*******"
              required
            />
          </div>

          <div className="mb-4">
            <Label className="block mb-2">Role</Label>
            <RadioGroup
              onValueChange={(value) => setInput({ ...input, role: value })}
              value={input.role}
              className="flex gap-6"
            >
              {["student", "recruiter"].map((role) => (
                <label
                  key={role}
                  htmlFor={role}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    id={role}
                    name="role"
                    value={role}
                    checked={input.role === role}
                    onChange={() => setInput({ ...input, role })}
                    className="hidden peer"
                  />
                  <div
                    className="w-5 h-5 border-2 border-gray-400 rounded-full flex items-center justify-center 
                    peer-checked:border-[#F83002] peer-checked:ring-2 peer-checked:ring-[#F83002] transition-all"
                  >
                    <div
                      className={`w-2.5 h-2.5 bg-[#F83002] rounded-full transition-all ${
                        input.role === role ? "opacity-100" : "opacity-0"
                      }`}
                    ></div>
                  </div>
                  <span
                    className={`text-gray-600 font-medium transition-all ${
                      input.role === role ? "text-[#F83002]" : ""
                    }`}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </span>
                </label>
              ))}
            </RadioGroup>
          </div>

          <div className="mb-6">
            <Label className="block mb-1">Profile Picture</Label>
            <Input
              accept="image/*"
              type="file"
              onChange={changeFileHandler}
              className="cursor-pointer"
            />
          </div>

          {loading ? (
            <Button className="w-full mb-4" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full mb-4 bg-[#F83002] hover:bg-[#d92902] text-white"
            >
              Signup
            </Button>
          )}

          <span className="text-sm text-gray-600 text-center block">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-medium">
              Login
            </Link>
          </span>
        </motion.form>
      </div>
    </div>
  );
}
