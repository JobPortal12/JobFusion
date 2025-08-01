import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import React from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Bookmark, LogOut, User2 } from "lucide-react";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";

export default function Navbar() {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Logout failed. Please try again."
      );
    }
  };

  return (
    <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between mx-auto max-w-7xl px-4 h-16">
        {/* Brand */}
        <h1 className="text-2xl font-bold">
          <Link to="/">Job</Link>
          <span className="text-[#F83002]">
            <Link to="/">Fusion</Link>
          </span>
        </h1>

        {/* Nav Links */}
        <div className="flex items-center gap-10">
          <ul className="flex items-center gap-6 text-gray-700 font-medium text-sm md:text-base">
            {user && user.role === "recruiter" ? (
              <>
                <li>
                  <Link to="/admin/companies">Companies</Link>
                </li>
                <li>
                  <Link to="/admin/jobs">Jobs</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/jobs">Jobs</Link>
                </li>
                <li>
                  <Link to="/browse">Browse</Link>
                </li>
              </>
            )}
          </ul>

          {/* Auth */}
          {!user ? (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button
                  variant="outline"
                  className="border-[#6A38C2] text-[#6A38C2] rounded-full"
                >
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-[#6A38C2] hover:bg-[#5b30a6] text-white rounded-full">
                  Signup
                </Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="h-9 w-9 cursor-pointer border-2 border-[#6A38C2]">
                  <AvatarImage src={user?.profile?.profilePhoto} alt="User" />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="w-72 rounded-xl shadow-lg p-4"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.profile?.profilePhoto} />
                  </Avatar>
                  <div>
                    <p className="font-semibold">{user?.fullname}</p>
                    <p className="text-sm text-gray-500 truncate max-w-[180px]">
                      {user?.profile?.bio || "No bio"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm text-gray-700">
                  {user.role === "student" && (
                    <>
                      <Button
                        asChild
                        variant="ghost"
                        className="w-full justify-start gap-2 hover:bg-gray-100"
                      >
                        <Link to="/profile">
                          <User2 className="w-4 h-4" />
                          View Profile
                        </Link>
                      </Button>

                      <Button
                        asChild
                        variant="ghost"
                        className="w-full justify-start gap-2 hover:bg-gray-100"
                      >
                        <Link to="/saved-jobs">
                          <Bookmark className="w-4 h-4" />
                          View Saved Jobs
                        </Link>
                      </Button>
                    </>
                  )}
                  <Button
                    onClick={logoutHandler}
                    variant="ghost"
                    className="w-full justify-start gap-2 hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
}
