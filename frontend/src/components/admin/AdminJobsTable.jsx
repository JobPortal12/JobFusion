import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { Edit2, Eye, MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AdminJobsTable = () => {
  const { allAdminJobs, searchJobByText } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState(allAdminJobs);
  const navigate = useNavigate();

  useEffect(() => {
    const filteredJobs =
      allAdminJobs.length >= 0 &&
      allAdminJobs.filter((job) => {
        if (!searchJobByText) return true;

        const query = searchJobByText.toLowerCase();
        return (
          job?.title?.toLowerCase().includes(query) ||
          job?.company?.name?.toLowerCase().includes(query)
        );
      });
    setFilterJobs(filteredJobs);
  }, [allAdminJobs, searchJobByText]);

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <Table>
        <TableCaption className="text-sm text-gray-500 mt-4">
          A list of your recently posted jobs
        </TableCaption>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="text-gray-700">Company Name</TableHead>
            <TableHead className="text-gray-700">Role</TableHead>
            <TableHead className="text-gray-700">Date Posted</TableHead>
            <TableHead className="text-right text-gray-700">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterJobs.length > 0 ? (
            filterJobs.map((job) => (
              <TableRow
                key={job._id}
                className="hover:bg-gray-50 transition-colors"
              >
                <TableCell className="font-medium">
                  {job?.company?.name}
                </TableCell>
                <TableCell>{job?.title}</TableCell>
                <TableCell>
                  {new Date(job?.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <Popover>
                    <PopoverTrigger className="p-2 rounded hover:bg-gray-100">
                      <MoreHorizontal />
                    </PopoverTrigger>
                    <PopoverContent className="w-40 p-2 space-y-2">
                      <div
                        onClick={() => navigate(`/admin/companies/${job._id}`)}
                        className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer"
                      >
                        <Edit2 className="w-4" />
                        <span>Edit</span>
                      </div>
                      <div
                        onClick={() =>
                          navigate(`/admin/jobs/${job._id}/applicants`)
                        }
                        className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer"
                      >
                        <Eye className="w-4" />
                        <span>Applicants</span>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-gray-500 py-6">
                No jobs posted yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminJobsTable;
