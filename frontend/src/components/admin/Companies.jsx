import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import CompaniesTable from './CompaniesTable';
import { useNavigate } from 'react-router-dom';
import useGetAllCompanies from '@/hooks/useGetAllCompanies';
import { useDispatch } from 'react-redux';
import { setSearchCompanyByText } from '@/redux/companySlice';
import Footer from '../shared/Footer';

export default function Companies() {
  useGetAllCompanies();
  const [input, setInput] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchCompanyByText(input));
  }, [input]);

  return (
    <>
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Top Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <Input
            className="w-full md:w-1/3 rounded-md border-gray-300 shadow-sm focus:border-[#6A38C2] focus:ring-[#6A38C2]"
            placeholder="Search companies by name..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            onClick={() => navigate('/admin/companies/create')}
            className="bg-[#6A38C2] hover:bg-[#5b30a6] text-white rounded-md"
          >
            + New Company
          </Button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow border border-gray-100 p-4">
          <CompaniesTable />
        </div>
      </div>

    </div>
      <Footer />
      </>
  );
}
