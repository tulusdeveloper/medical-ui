// components/hr/departments/DepartmentModal.js
"use client"
import React, { useState, useMemo, memo } from 'react';
import { Edit, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const DepartmentList = memo(({ departments, onEdit, isLoading }) => {
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const toggleDescription = (id) => {
    setExpandedDescriptions(prev => ({...prev, [id]: !prev[id]}));
  };

  const paginatedDepartments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return departments.slice(startIndex, startIndex + itemsPerPage);
  }, [departments, currentPage]);

  const totalPages = Math.ceil(departments.length / itemsPerPage);

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading departments...</p>
      </div>
    );
  }

  if (!departments || departments.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No departments</h3>
        <p className="mt-1 text-sm text-gray-500">No departments are available at this time.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedDepartments.map((department) => (
              <tr key={department.id} className="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                <td className="py-4 px-4 whitespace-nowrap">{department.name}</td>
                <td className="py-4 px-4">
                  <button
                    onClick={() => toggleDescription(department.id)}
                    className="text-blue-600 hover:text-blue-900 transition-colors duration-150 ease-in-out"
                  >
                    {expandedDescriptions[department.id] ? 'Hide' : 'Show'} Description
                  </button>
                  {expandedDescriptions[department.id] && (
                    <div className="mt-2 text-sm text-gray-500">{department.description}</div>
                  )}
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <button
                    onClick={() => onEdit(department)}
                    className="text-blue-600 hover:text-blue-900 transition-colors duration-150 ease-in-out"
                    aria-label={`Edit ${department.name}`}
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-md disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-md disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
});

export default DepartmentList;