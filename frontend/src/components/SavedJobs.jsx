import React from "react";
import { useSelector } from "react-redux";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import Job from "./Job"; 

export default function SavedJobs() {
  const { savedJobs } = useSelector((state) => state.job);

  return (
    <>
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto my-10">
        <h1 className="text-2xl font-bold mb-6">Saved Jobs</h1>
        {savedJobs.length === 0 ? (
          <p className="text-gray-500 text-center">No saved jobs yet.</p>
        ) : (
          <div className="grid gap-6">
            {savedJobs.map((job) => (
              <Job key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
