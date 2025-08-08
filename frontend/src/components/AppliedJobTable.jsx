import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from './ui/table';
import { Badge } from './ui/badge';
import { useSelector } from 'react-redux';

export default function AppliedJobTable() {
  const { allAppliedJobs } = useSelector(store => store.job);

  return (
    <div className="w-full overflow-x-auto bg-white border border-gray-200 rounded-lg shadow">
      <Table>
        <TableCaption className="text-sm text-gray-500 my-2">
          A list of your applied jobs
        </TableCaption>
        <TableHeader>
          <TableRow className="bg-gray-100 text-sm text-gray-700">
            <TableHead className="py-3 px-4">Date</TableHead>
            <TableHead className="py-3 px-4">Job Role</TableHead>
            <TableHead className="py-3 px-4">Company</TableHead>
            <TableHead className="py-3 px-4 text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allAppliedJobs?.length <= 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                You haven't applied for any job yet.
              </TableCell>
            </TableRow>
          ) : (
            allAppliedJobs.map((appliedJob) => {
              const status = appliedJob?.status || "pending";
              const statusColor =
                status === "rejected"
                  ? "bg-red-500"
                  : status === "accepted"
                  ? "bg-green-500"
                  : "bg-gray-500";

              return (
                <TableRow
                  key={appliedJob?._id}
                  className="hover:bg-gray-50 transition-all"
                >
                  <TableCell className="py-3 px-4">
                    {appliedJob?.createdAt?.split("T")[0]}
                  </TableCell>
                  <TableCell className="py-3 px-4 font-medium text-gray-800">
                    {appliedJob?.job?.title || "N/A"}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-gray-700">
                    {appliedJob?.job?.company?.name || "N/A"}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-right">
                    <Badge
                      className={`${statusColor} text-white px-3 py-1 rounded-full text-xs font-semibold`}
                    >
                      {status.toUpperCase()}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
