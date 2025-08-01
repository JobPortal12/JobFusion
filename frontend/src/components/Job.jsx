import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toggleSaveJob } from "@/redux/jobSlice";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export default function Job({ job }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { savedJobs = [] } = useSelector((state) => state.job);
  const { user } = useSelector((state) => state.auth);

  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  };

  const isSaved = savedJobs.some((savedJob) => savedJob._id === job._id);

  return (
    <div className="p-5 rounded-md shadow-xl bg-white border-gray-100">
      {/* Top Bar: Time + Save Icon */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {daysAgoFunction(job?.createdAt) === 0
            ? "Today"
            : `${daysAgoFunction(job?.createdAt)} days ago`}
        </p>

        {user?.role === "student" && (
          <Button
            variant="outline"
            className="rounded-full"
            size="icon"
            onClick={() => dispatch(toggleSaveJob(job))}
          >
            {isSaved ? (
              <BookmarkCheck className="text-[#7209b7]" />
            ) : (
              <Bookmark className="text-gray-500" />
            )}
          </Button>
        )}
      </div>

      {/* Company Info */}
      <div className="flex items-center gap-2 my-2">
        <Button className="p-6" variant="outline" size="icon">
          <Avatar>
            <AvatarImage src={job?.company?.logo} />
          </Avatar>
        </Button>
        <div>
          <h1 className="font-medium text-lg">{job?.company?.name}</h1>
          <p className="text-sm text-gray-500">India</p>
        </div>
      </div>

      {/* Job Title & Description */}
      <div>
        <h1 className="font-bold text-lg my-2">{job?.title}</h1>
        <p className="text-sm text-gray-600">{job?.description}</p>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2 mt-4">
        <Badge className="text-blue-700 font-bold" variant="ghost">
          {job?.position} Positions
        </Badge>
        <Badge className="text-[#F83002] font-bold" variant="ghost">
          {job?.jobType}
        </Badge>
        <Badge className="text-[#7209b7] font-bold" variant="ghost">
          {job?.salary} LPA
        </Badge>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 mt-4">
        <Button
          onClick={() => navigate(`/description/${job?._id}`)}
          variant="outline"
        >
          Details
        </Button>

        {user?.role === "student" && (
          <Button
            onClick={() => dispatch(toggleSaveJob(job))}
            className={isSaved ? "bg-gray-400 text-white" : "bg-[#7209b7] text-white"}
          >
            {isSaved ? "Unsave" : "Save for later"}
          </Button>
        )}
      </div>
    </div>
  );
}
