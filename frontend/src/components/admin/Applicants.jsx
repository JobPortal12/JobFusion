import React, { useEffect } from 'react';
import Navbar from '../shared/Navbar';
import ApplicantsTable from './ApplicantsTable';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants } from '@/redux/applicationSlice';
import { motion } from 'framer-motion';

const Applicants = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const { applicants } = useSelector((store) => store.application);

  useEffect(() => {
    const fetchAllApplicants = async () => {
      try {
        const res = await axios.get(
          `${APPLICATION_API_END_POINT}/${params.id}/applicants`,
          { withCredentials: true }
        );
        dispatch(setAllApplicants(res.data.job));
      } catch (error) {
        console.error(error);
      }
    };
    fetchAllApplicants();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#f9f7ff] via-[#f3effc] to-[#ece6fa]">
      <Navbar />
      <motion.div
        className="max-w-7xl mx-auto py-10 px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#6A38C2] flex items-center gap-2">
            🧑‍💼 Applicants 
            <span className="text-gray-700 text-base bg-white border border-gray-200 px-3 py-1 rounded-full shadow-sm">
              {applicants?.applications?.length || 0}
            </span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            View the list of applicants who applied to this job.
          </p>
        </div>
        <ApplicantsTable />
      </motion.div>
    </div>
  );
};

export default Applicants;
