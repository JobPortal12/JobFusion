import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const [input, setInput] = useState({ email: "", password: "", role: "" });
  const { loading, user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
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
          className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md"
        >
          <h1 className="font-bold text-2xl text-center mb-6">Login</h1>

          <div className="mb-4">
            <Label>Email</Label>
            <Input
              type="email"
              value={input.email}
              name="email"
              onChange={changeEventHandler}
              placeholder="example@email.com"
              required
            />
          </div>

          <div className="mb-4">
            <Label>Password</Label>
            <Input
              type="password"
              value={input.password}
              name="password"
              onChange={changeEventHandler}
              placeholder="Enter Password"
              required
            />
          </div>

          <div className="flex justify-start mb-6">
            <RadioGroup
              onValueChange={(value) => setInput({ ...input, role: value })}
              value={input.role}
              className="flex gap-6 justify-center"
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
                    peer-checked:border-[#6A38C2] peer-checked:ring-2 peer-checked:ring-[#6A38C2] transition-all"
                  >
                    <div
                      className={`w-2.5 h-2.5 bg-[#6A38C2] rounded-full transition-all ${
                        input.role === role ? "opacity-100" : "opacity-0"
                      }`}
                    ></div>
                  </div>
                  <span
                    className={`text-gray-600 font-medium transition-all ${
                      input.role === role ? "text-[#6A38C2]" : ""
                    }`}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </span>
                </label>
              ))}
            </RadioGroup>
          </div>

          {loading ? (
            <Button className="w-full mb-4" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full mb-4 bg-[#6A38C2] hover:bg-[#5b30a6]"
            >
              Login
            </Button>
          )}

          <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-600 gap-2 sm:gap-0">
            <span>
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-600 font-medium">
                Signup
              </Link>
            </span>
            <Link to="/forgot" className="text-blue-600 font-medium">
              Forgot Password?
            </Link>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
