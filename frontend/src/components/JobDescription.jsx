import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Briefcase, MapPin, CalendarDays, Users, Currency } from "lucide-react";

export default function JobDescription() {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const [isApplied, setIsApplied] = useState(false);
  const navigate = useNavigate();
  const { id: jobId } = useParams();
  const dispatch = useDispatch();

  const applyJobHandler = async () => {
    try {
      const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {
        withCredentials: true,
      });
       // console.log("printing the res -> ",res.data);
        
      if (res.data.success) {
        setIsApplied(true);
        const updatedSingleJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?.userId }],
        };
        dispatch(setSingleJob(updatedSingleJob));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to apply.");
    }
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });

        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          const isAppliedCheck = res.data.job.applications?.some(
            (application) => application.applicant === user?.userId
          );
          setIsApplied(isAppliedCheck || false);
        }
      } catch (error) {
        console.error("Failed to fetch job:", error);
      }
    };

    fetchSingleJob();
  }, [jobId, dispatch, user?.userId]);

  if (!singleJob) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="bg-white rounded-xl shadow-md p-6 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">{singleJob?.title}</h1>
            <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
              <Briefcase size={16} className="text-purple-600" />
              {singleJob?.company?.name || "Anonymous Company"}
            </p>
          </div>
          <Button
            onClick={isApplied ? null : applyJobHandler}
            disabled={isApplied}
            className={`rounded-lg text-white px-6 py-2 text-sm transition-all duration-200 ${
              isApplied
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#7209b7] hover:bg-[#5f32ad]"
            }`}
          >
            {isApplied ? "Already Applied" : "Apply Now"}
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm">
            <Users className="text-blue-600" size={18} />
            <span className="text-gray-700 font-medium">
              {singleJob?.position} Position{singleJob?.position > 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Currency className="text-green-600" size={18} />
            <span className="text-gray-700 font-medium">{singleJob?.salary} LPA</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="text-pink-600" size={18} />
            <span className="text-gray-700 font-medium">{singleJob?.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CalendarDays className="text-orange-600" size={18} />
            <span className="text-gray-700 font-medium">
              {new Date(singleJob?.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Badge className="text-[#F83002] font-bold" variant="ghost">
              {singleJob?.jobType}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-gray-700">Applicants:</span>
            <span className="text-gray-600">{singleJob?.applications?.length}</span>
          </div>
        </div>

        <hr className="my-4 border-gray-200" />

        <div className="space-y-4 text-gray-800 leading-relaxed">
          <div>
            <h2 className="font-semibold text-lg mb-1">Job Description</h2>
            <p>{singleJob?.description}</p>
          </div>
          <div>
            <h2 className="font-semibold text-lg mb-1">Required Experience</h2>
            <p>{singleJob?.experience} years</p>
          </div>
        </div>
      <Button className="bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-200 mt-5" onClick = {() =>navigate(-1)}> ← back</Button>
      </div>
    </div>
  );
}
