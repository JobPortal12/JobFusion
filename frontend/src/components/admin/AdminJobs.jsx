import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import AdminJobsTable from "./AdminJobsTable";
import useGetAllAdminJobs from "@/hooks/useGetAllAdminJobs";
import { setSearchJobByText } from "@/redux/jobSlice";
import Footer from "../shared/Footer";

export default function AdminJobs() {
  useGetAllAdminJobs();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow px-4">
        <div className="max-w-6xl mx-auto my-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <Input
              className="sm:w-80 w-full border-gray-300 focus:ring-2 focus:ring-[#6A38C2] rounded-lg shadow-sm"
              placeholder="Search by job title, role..."
              onChange={(e) => setInput(e.target.value)}
            />
            <Button
              onClick={() => navigate("/admin/jobs/create")}
              className="bg-[#6A38C2] hover:bg-[#5528a2] rounded-xl"
            >
              Post New Job
            </Button>
          </div>

          <AdminJobsTable />
        </div>
      </main>

      <Footer />
    </div>
  );
}
