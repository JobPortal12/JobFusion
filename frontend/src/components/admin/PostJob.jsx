import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function PostJob() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { companies } = useSelector((store) => store.company);
  const [input, setInput] = useState({
    title: '',
    description: '',
    requirements: '',
    salary: '',
    location: '',
    jobType: '',
    experience: '',
    position: 0,
    companyId: '',
  });

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectChangeHandler = (value) => {
    const selectedCompany = companies.find(
      (company) => company.name.toLowerCase() === value
    );
    setInput({ ...input, companyId: selectedCompany._id });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate('/admin/jobs');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-tr from-[#f9f7ff] via-[#f2edfb] to-[#ece6fa] min-h-screen">
      <Navbar />
      <motion.div
        className="flex justify-center py-10 px-4"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <form
          onSubmit={submitHandler}
          className="w-full max-w-4xl bg-white/70 backdrop-blur-md shadow-2xl rounded-3xl p-10 border border-violet-200"
        >
          <h2 className="text-3xl font-bold text-center text-[#6A38C2] mb-8">
             Post a New Job
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: 'Title', name: 'title' },
              { label: 'Description', name: 'description' },
              { label: 'Requirements', name: 'requirements' },
              { label: 'Salary', name: 'salary' },
              { label: 'Location', name: 'location' },
              { label: 'Job Type', name: 'jobType' },
              { label: 'Experience Level', name: 'experience' },
              { label: 'No of Positions', name: 'position', type: 'number' },
            ].map(({ label, name, type = 'text' }) => (
              <div key={name}>
                <Label className="text-sm text-gray-700">{label}</Label>
                <Input
                  type={type}
                  name={name}
                  value={input[name]}
                  onChange={changeEventHandler}
                  placeholder={`Enter ${label.toLowerCase()}`}
                  className="mt-2 border-gray-300 focus:ring-2 focus:ring-[#6A38C2] rounded-lg"
                />
              </div>
            ))}

            {companies.length > 0 && (
              <div className="col-span-1 md:col-span-2">
                <Label className="text-sm text-gray-700">Company</Label>
                <Select onValueChange={selectChangeHandler}>
                  <SelectTrigger className="mt-2 border-gray-300 rounded-lg">
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {companies.map((company) => (
                        <SelectItem
                          key={company._id}
                          value={company.name.toLowerCase()}
                        >
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {loading ? (
            <Button className="w-full mt-8" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Posting...
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full mt-8 bg-[#6A38C2] hover:bg-[#5b30a6] transition-all text-white rounded-full py-2 text-lg shadow-md"
            >
               Post Job
            </Button>
          )}

          {companies.length === 0 && (
            <p className="text-sm text-center text-red-500 font-medium mt-4">
              * Please register a company before posting a job.
            </p>
          )}
        </form>
      </motion.div>
      <Footer />
    </div>
  );
}
