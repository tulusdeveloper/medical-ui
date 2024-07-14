import React, { useState, useMemo, memo } from 'react';
import { Edit, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const VisitTypeList = memo(({ visitTypes, onEdit, isLoading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const paginatedVisitTypes = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return visitTypes.slice(startIndex, startIndex + itemsPerPage);
  }, [visitTypes, currentPage]);

  const totalPages = Math.ceil(visitTypes.length / itemsPerPage);

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading visit types...</p>
      </div>
    );
  }

  if (!visitTypes || visitTypes.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No visit types</h3>
        <p className="mt-1 text-sm text-gray-500">No visit types are available at this time.</p>
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
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insurance</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedVisitTypes.map((visitType) => (
              <tr key={visitType.id} className="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                <td className="py-4 px-4 whitespace-nowrap">{visitType.name}</td>
                <td className="py-4 px-4 whitespace-nowrap">{visitType.type}</td>
                <td className="py-4 px-4 whitespace-nowrap">
                  {visitType.type === 'INSURANCE' ? (visitType.insurance ? visitType.insurance.name : 'N/A') : 'N/A'}
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    visitType.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {visitType.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <button
                    onClick={() => onEdit(visitType)}
                    className="text-blue-600 hover:text-blue-900 transition-colors duration-150 ease-in-out"
                    aria-label={`Edit ${visitType.name}`}
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

export default VisitTypeList;