import React, { useState } from "react";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Contact, Mail, Pen } from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import AppliedJobTable from "./AppliedJobTable";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useSelector, useDispatch } from "react-redux";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";
import Footer from "./shared/Footer";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import axios from "axios";
import { toast } from "sonner";
import { USER_API_END_POINT } from "@/utils/constant";

export default function Profile() {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [uploading, setUploading] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const response = await axios.put(
        `${USER_API_END_POINT}/update-profile-pic`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      toast.success("Profile picture updated!");
      dispatch({
        type: "auth/updateProfilePhoto",
        payload: response.data.profilePhoto,
      });

      setUploadDialog(false);
    } catch (error) {
      toast.error("Failed to update profile picture.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-6 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between gap-6 sm:items-start">
          {/* Avatar + Bio */}
          <div className="flex items-center gap-5">
            <div className="relative h-24 w-24 shrink-0">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={user?.profile?.profilePhoto}
                  alt="Profile Picture"
                />
              </Avatar>
              <Button
                variant="secondary"
                size="icon"
                className="absolute bottom-0 right-0 h-6 w-6 p-1"
                onClick={() => setUploadDialog(true)}
              >
                <Pen className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <h1 className="font-semibold text-xl">{user?.fullname}</h1>
              <p className="text-sm text-gray-600">{user?.profile?.bio}</p>
            </div>
          </div>

          {/* Edit Profile Button */}
          <Button
            className="self-start sm:self-auto"
            variant="outline"
            onClick={() => setOpen(true)}
          >
            <Pen className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </div>

        {/* Contact Info */}
        <div className="my-5 space-y-3 text-sm text-gray-700">
          <div className="flex items-center gap-3">
            <Mail />
            <span>{user?.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <Contact />
            <span>{user?.phoneNumber}</span>
          </div>
        </div>

        {/* Skills */}
        <div className="my-4">
          <h2 className="font-semibold mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {user?.profile?.skills?.length > 0 ? (
              user.profile.skills.map((item, index) => (
                <Badge key={index}>{item}</Badge>
              ))
            ) : (
              <span className="text-gray-500">Not Applicable</span>
            )}
          </div>
        </div>

        {/* Resume */}
        <div className="mt-6">
          <Label className="text-md font-semibold">Resume</Label>
          {user?.profile?.resume ? (
            <div className="mt-1">
              <a
                href={user.profile.resume}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                {user.profile.resumeOriginalName || "View Resume"}
              </a>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Not uploaded</p>
          )}
        </div>
      </div>

      {/* Applied Jobs Table */}
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 mt-6">
        <h1 className="text-lg font-semibold mb-4">Applied Jobs</h1>
        <AppliedJobTable />
      </div>

      {/* Update Profile Dialog */}
      <UpdateProfileDialog open={open} setOpen={setOpen} />

      {/* Upload Profile Picture Dialog */}
      <Dialog open={uploadDialog} onOpenChange={setUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Profile Picture</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePicUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0 file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
