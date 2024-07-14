import React, { useState, useMemo, memo } from 'react';
import { Edit, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const InsuranceList = memo(({ insurances, onEdit, isLoading }) => {
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const toggleDescription = (id) => {
    setExpandedDescriptions(prev => ({...prev, [id]: !prev[id]}));
  };

  const paginatedInsurances = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return insurances.slice(startIndex, startIndex + itemsPerPage);
  }, [insurances, currentPage]);

  const totalPages = Math.ceil(insurances.length / itemsPerPage);

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading insurances...</p>
      </div>
    );
  }

  if (!insurances || insurances.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No insurances</h3>
        <p className="mt-1 text-sm text-gray-500">No insurances are available at this time.</p>
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
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy Number</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coverage Details</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedInsurances.map((insurance) => (
              <tr key={insurance.id} className="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                <td className="py-4 px-4 whitespace-nowrap">{insurance.name}</td>
                <td className="py-4 px-4 whitespace-nowrap">{insurance.policy_number}</td>
                <td className="py-4 px-4">
                  <button
                    onClick={() => toggleDescription(insurance.id)}
                    className="text-blue-600 hover:text-blue-900 transition-colors duration-150 ease-in-out"
                  >
                    {expandedDescriptions[insurance.id] ? 'Hide' : 'Show'} Details
                  </button>
                  {expandedDescriptions[insurance.id] && (
                    <div className="mt-2 text-sm text-gray-500">{insurance.coverage_details}</div>
                  )}
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <button
                    onClick={() => onEdit(insurance)}
                    className="text-blue-600 hover:text-blue-900 transition-colors duration-150 ease-in-out"
                    aria-label={`Edit ${insurance.name}`}
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

export default InsuranceList;