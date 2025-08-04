import React from "react";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function LatestJobCards({ job }) {
  const navigate = useNavigate();

  return (
    <motion.div
      onClick={() => navigate(`/description/${job._id}`)}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="p-5 rounded-xl shadow-md bg-white border border-gray-200 cursor-pointer hover:shadow-lg transition-all duration-300"
    >
      <div className="mb-2">
        <h1 className="font-semibold text-lg">{job?.company?.name}</h1>
        <p className="text-sm text-gray-500">India</p>
      </div>

      <div className="mb-3">
        <h2 className="font-bold text-xl text-[#6A38C2]">{job?.title}</h2>
        <p className="text-sm text-gray-600 line-clamp-3">
          {job?.description}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-4">
        <Badge
          className="text-blue-700 font-semibold px-2 py-1"
          variant="ghost"
        >
          {job?.position} Positions
        </Badge>
        <Badge
          className="text-[#F83002] font-semibold px-2 py-1"
          variant="ghost"
        >
          {job?.jobType}
        </Badge>
        <Badge
          className="text-[#7209b7] font-semibold px-2 py-1"
          variant="ghost"
        >
          {job?.salary} LPA
        </Badge>
      </div>
    </motion.div>
  );
}
