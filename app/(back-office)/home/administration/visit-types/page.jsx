"use client";
import React, { useState, useEffect, useMemo } from 'react';
import VisitTypeList from '@/components/administration/VisitTypeList';
import VisitTypeModal from '@/components/administration/VisitTypeModal';
import { PlusCircle, Search, X } from "lucide-react";
import Link from "next/link";
import debounce from "lodash/debounce";
import withAuth from '@/utils/withAuth';
import { visitTypeApi, insuranceApi } from '@/utils/api';

function VisitTypePage() {
  const [visitTypes, setVisitTypes] = useState([]);
  const [insurances, setInsurances] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVisitType, setSelectedVisitType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchVisitTypes();
    fetchInsurances();
  }, []);

  const fetchVisitTypes = async () => {
    setIsLoading(true);
    try {
      const response = await visitTypeApi.fetchVisitTypes();
      setVisitTypes(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching visit types:', error);
      setError("Failed to fetch visit types. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInsurances = async () => {
    try {
      const response = await insuranceApi.fetchInsurances();
      setInsurances(response.data);
    } catch (error) {
      console.error('Error fetching insurances:', error);
    }
  };

  const handleEdit = (visitType) => {
    setSelectedVisitType(visitType);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    fetchVisitTypes();
    setIsModalOpen(false);
    setSelectedVisitType(null);
  };

  const debouncedSearch = useMemo(
    () => debounce((term) => setSearchTerm(term), 300),
    []
  );

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
    document.getElementById("search-input").value = "";
  };

  const filteredVisitTypes = useMemo(() => {
    return visitTypes.filter((visitType) =>
      visitType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitType.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [visitTypes, searchTerm]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold">Visit Type Management</h2>
        <div className="space-x-4">
          <Link
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-300 inline-flex items-center"
            href="/home/administration"
          >
            Back to Administration
          </Link>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 inline-flex items-center"
          >
            <PlusCircle className="mr-2" size={20} />
            Add New Visit Type
          </button>
        </div>
      </div>

      <div className="mb-6 relative">
        <input
          id="search-input"
          type="text"
          placeholder="Search visit types..."
          onChange={handleSearchChange}
          className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {error ? (
        <div className="text-center py-4 text-red-500 bg-red-100 border border-red-400 rounded-lg p-4">
          <p>{error}</p>
          <button
            onClick={fetchVisitTypes}
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300"
          >
            Retry
          </button>
        </div>
      ) : (
        <VisitTypeList
          visitTypes={filteredVisitTypes}
          onEdit={handleEdit}
          isLoading={isLoading}
        />
      )}

      <VisitTypeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
        initialData={selectedVisitType}
        insurances={insurances}
      />
    </div>
  );
}

export default withAuth(VisitTypePage);