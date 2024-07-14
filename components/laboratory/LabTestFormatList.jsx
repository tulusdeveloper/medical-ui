import React from "react";
import { Edit, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const LabTestFormatList = ({ labTestFormats, onEdit }) => {
  const [expandedGroups, setExpandedGroups] = useState({});

  if (!labTestFormats || labTestFormats.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No lab test formats</h3>
        <p className="mt-1 text-sm text-gray-500">No lab test formats are available at this time.</p>
      </div>
    );
  }

  const groupedFormats = labTestFormats.reduce((acc, format) => {
    const group = format.lab_test_name || 'Uncategorized';
    if (!acc[group]) acc[group] = [];
    acc[group].push(format);
    return acc;
  }, {});

  const toggleGroup = (group) => {
    setExpandedGroups(prev => ({...prev, [group]: !prev[group]}));
  };

  return (
    <div className="space-y-4">
      {Object.entries(groupedFormats).map(([group, formats]) => (
        <div key={group} className="bg-white shadow-md rounded-lg overflow-hidden">
          <button
            className="w-full bg-gray-100 px-4 py-3 text-left font-medium flex justify-between items-center"
            onClick={() => toggleGroup(group)}
          >
            {group}
            {expandedGroups[group] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          {expandedGroups[group] && (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Male Range</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Female Range</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {formats.map((format) => (
                    <tr key={format.id} className="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                      <td className="py-4 px-4 whitespace-nowrap">{format.name || 'N/A'}</td>
                      <td className="py-4 px-4 whitespace-nowrap">{format.units || 'N/A'}</td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        {format.male_lower_limit != null && format.male_upper_limit != null
                          ? `${format.male_lower_limit} - ${format.male_upper_limit}`
                          : 'N/A'}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        {format.female_lower_limit != null && format.female_upper_limit != null
                          ? `${format.female_lower_limit} - ${format.female_upper_limit}`
                          : 'N/A'}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <button
                          onClick={() => onEdit(format)}
                          className="text-blue-600 hover:text-blue-900 transition-colors duration-150 ease-in-out"
                          aria-label={`Edit ${format.name}`}
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default LabTestFormatList;