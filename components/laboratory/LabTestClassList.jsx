import React, { useState } from 'react';
import { Edit, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

const LabTestClassList = ({ labTestClasses, onEdit }) => {
  const [expandedGroups, setExpandedGroups] = useState({});
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  if (!labTestClasses || labTestClasses.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No lab test classes</h3>
        <p className="mt-1 text-sm text-gray-500">No lab test classes are available at this time.</p>
      </div>
    );
  }

  const groupedClasses = labTestClasses.reduce((acc, labTestClass) => {
    const group = labTestClass.category || 'Uncategorized';
    if (!acc[group]) acc[group] = [];
    acc[group].push(labTestClass);
    return acc;
  }, {});

  const toggleGroup = (group) => {
    setExpandedGroups(prev => ({...prev, [group]: !prev[group]}));
  };

  const toggleDescription = (id) => {
    setExpandedDescriptions(prev => ({...prev, [id]: !prev[id]}));
  };

  return (
    <div className="space-y-4">
      {Object.entries(groupedClasses).map(([group, classes]) => (
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
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {classes.map((labTestClass) => (
                    <tr key={labTestClass.id} className="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                      <td className="py-4 px-4 whitespace-nowrap">{labTestClass.name}</td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => toggleDescription(labTestClass.id)}
                          className="text-blue-600 hover:text-blue-900 transition-colors duration-150 ease-in-out"
                        >
                          {expandedDescriptions[labTestClass.id] ? 'Hide' : 'Show'} Description
                        </button>
                        {expandedDescriptions[labTestClass.id] && (
                          <div className="mt-2 text-sm text-gray-500">{labTestClass.description}</div>
                        )}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${
                          labTestClass.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {labTestClass.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <button
                          onClick={() => onEdit(labTestClass)}
                          className="text-blue-600 hover:text-blue-900 transition-colors duration-150 ease-in-out"
                          aria-label={`Edit ${labTestClass.name}`}
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

export default LabTestClassList;