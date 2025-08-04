import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Label } from "../ui/label";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import useGetCompanyById from "@/hooks/useGetCompanyById";
import Footer from "../shared/Footer";

export default function CompanySetup() {
  const params = useParams();
  useGetCompanyById(params.id);

  const { singleCompany } = useSelector((store) => store.company);
  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    file: null,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("description", input.description);
    formData.append("location", input.location);
    formData.append("website", input.website);
    if (input.file) formData.append("file", input.file);

    try {
      setLoading(true);
      const res = await axios.put(
        `${COMPANY_API_END_POINT}/update/${params.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/companies");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setInput({
      name: singleCompany.name || "",
      description: singleCompany.description || "",
      website: singleCompany.website || "",
      location: singleCompany.location || "",
      file: null,
    });
  }, [singleCompany]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-gray-100">
      <Navbar />

      <main className="flex-grow px-4 py-10">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <Button
              onClick={() => navigate("/admin/companies")}
              variant="outline"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <h1 className="text-2xl font-semibold text-gray-800">
              Company Setup
            </h1>
          </div>

          <form onSubmit={submitHandler} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="text-gray-700">Company Name</Label>
                <Input
                  type="text"
                  name="name"
                  value={input.name}
                  onChange={changeEventHandler}
                  placeholder="e.g. Microsoft"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-gray-700">Location</Label>
                <Input
                  type="text"
                  name="location"
                  value={input.location}
                  onChange={changeEventHandler}
                  placeholder="e.g. Bangalore"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-gray-700">Description</Label>
                <Input
                  type="text"
                  name="description"
                  value={input.description}
                  onChange={changeEventHandler}
                  placeholder="e.g. Product-based company"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-gray-700">Website</Label>
                <Input
                  type="text"
                  name="website"
                  value={input.website}
                  onChange={changeEventHandler}
                  placeholder="e.g. https://company.com"
                  className="mt-1"
                />
              </div>
              <div className="md:col-span-2">
                <Label className="text-gray-700">Company Logo</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={changeFileHandler}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                className="bg-[#6A38C2] hover:bg-[#5528a2] text-white rounded-xl px-6 py-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Update Company"
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
