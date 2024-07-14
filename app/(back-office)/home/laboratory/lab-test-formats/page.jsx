"use client";
import React, { useState, useEffect, useMemo } from "react";
import LabTestFormatList from "@/components/laboratory/LabTestFormatList";
import LabTestFormatModal from "@/components/laboratory/LabTestFormatModal";
import { PlusCircle, Search, X } from "lucide-react";
import Link from "next/link";
import debounce from "lodash/debounce";
import withAuth from "@/utils/withAuth";
import { laboratoryApi } from "@/utils/api";

function LabTestFormatsPage() {
  const [labTestFormats, setLabTestFormats] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchLabTestFormats();
  }, []);

  const fetchLabTestFormats = async () => {
    setIsLoading(true);
    try {
      const response = await laboratoryApi.fetchLabTestFormats();
      setLabTestFormats(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching lab test formats:", error);
      setError("Failed to fetch lab test formats. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (format) => {
    setSelectedFormat(format);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedFormat(null);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    fetchLabTestFormats();
    setIsModalOpen(false);
    setSelectedFormat(null);
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

  const filteredFormats = useMemo(() => {
    return labTestFormats.filter((format) => {
      const nameMatch =
        format.name &&
        format.name.toLowerCase().includes(searchTerm.toLowerCase());
      const labTestNameMatch =
        format.lab_test_name &&
        format.lab_test_name.toLowerCase().includes(searchTerm.toLowerCase());
      const labTestMatch =
        format.lab_test &&
        format.lab_test.name &&
        format.lab_test.name.toLowerCase().includes(searchTerm.toLowerCase());
      return nameMatch || labTestNameMatch || labTestMatch;
    });
  }, [labTestFormats, searchTerm]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold">Lab Test Formats</h2>
        <div className="space-x-4">
          <Link
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-300 inline-flex items-center"
            href="/home/laboratory"
          >
            Back to Lab Setup
          </Link>
          <button
            onClick={handleAddNew}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 inline-flex items-center"
          >
            <PlusCircle className="mr-2" size={20} />
            Add New Format
          </button>
        </div>
      </div>

      <div className="mb-6 relative">
        <input
          id="search-input"
          type="text"
          placeholder="Search formats..."
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

      {isLoading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading lab test formats...</p>
        </div>
      ) : error ? (
        <div className="text-center py-4 text-red-500 bg-red-100 border border-red-400 rounded-lg p-4">
          <p>{error}</p>
          <button
            onClick={fetchLabTestFormats}
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300"
          >
            Retry
          </button>
        </div>
      ) : (
        <LabTestFormatList
          labTestFormats={filteredFormats}
          onEdit={handleEdit}
        />
      )}

      {filteredFormats.length === 0 && !isLoading && !error && (
        <div className="text-center py-4 text-gray-500">
          No lab test formats found matching your search.
        </div>
      )}

      <LabTestFormatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
        initialData={selectedFormat}
      />
    </div>
  );
}

export default withAuth(LabTestFormatsPage);