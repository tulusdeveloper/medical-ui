"use client"
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { laboratoryApi } from '@/utils/api';
import withAuth from '@/utils/withAuth';

const LabTestFormatModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
  const [formData, setFormData] = useState({
    lab_test: '',
    name: '',
    units: '',
    male_lower_limit: '',
    male_upper_limit: '',
    female_lower_limit: '',
    female_upper_limit: '',
    reference_notes: '',
    order: 0
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [labTests, setLabTests] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchLabTests();
      if (initialData) {
        setFormData(initialData);
      } else {
        resetForm();
      }
    }
  }, [isOpen, initialData]);

  const fetchLabTests = async () => {
    try {
      const response = await laboratoryApi.fetchLabTests();
      setLabTests(response.data);
    } catch (error) {
      console.error('Error fetching lab tests:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      lab_test: '',
      name: '',
      units: '',
      male_lower_limit: '',
      male_upper_limit: '',
      female_lower_limit: '',
      female_upper_limit: '',
      reference_notes: '',
      order: 0
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.lab_test) tempErrors.lab_test = "Lab Test is required";
    if (!formData.name.trim()) tempErrors.name = "Name is required";
    if (!formData.units.trim()) tempErrors.units = "Units are required";
    return tempErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tempErrors = validateForm();
    setErrors(tempErrors);

    if (Object.keys(tempErrors).length === 0) {
      setIsLoading(true);
      try {
        if (initialData) {
          await laboratoryApi.updateLabTestFormats(initialData.id, formData);
        } else {
          await laboratoryApi.createLabTestFormats(formData);
        }
        onSuccess();
        handleClose();
      } catch (error) {
        console.error('Error submitting form:', error);
        setErrors({ submit: 'An error occurred. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{initialData ? 'Edit' : 'Add'} Lab Test Format</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="lab_test" className="block mb-1 font-medium">Lab Test</label>
            <select
              id="lab_test"
              name="lab_test"
              value={formData.lab_test}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Lab Test</option>
              {labTests.map(test => (
                <option key={test.id} value={test.id}>{test.name}</option>
              ))}
            </select>
            {errors.lab_test && <p className="text-red-500 text-sm mt-1">{errors.lab_test}</p>}
          </div>
          <div>
            <label htmlFor="name" className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="units" className="block mb-1 font-medium">Units</label>
            <input
              type="text"
              id="units"
              name="units"
              value={formData.units}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            {errors.units && <p className="text-red-500 text-sm mt-1">{errors.units}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="male_lower_limit" className="block mb-1 font-medium">Male Lower Limit</label>
              <input
                type="number"
                id="male_lower_limit"
                name="male_lower_limit"
                value={formData.male_lower_limit}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                step="any"
              />
            </div>
            <div>
              <label htmlFor="male_upper_limit" className="block mb-1 font-medium">Male Upper Limit</label>
              <input
                type="number"
                id="male_upper_limit"
                name="male_upper_limit"
                value={formData.male_upper_limit}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                step="any"
              />
            </div>
            <div>
              <label htmlFor="female_lower_limit" className="block mb-1 font-medium">Female Lower Limit</label>
              <input
                type="number"
                id="female_lower_limit"
                name="female_lower_limit"
                value={formData.female_lower_limit}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                step="any"
              />
            </div>
            <div>
              <label htmlFor="female_upper_limit" className="block mb-1 font-medium">Female Upper Limit</label>
              <input
                type="number"
                id="female_upper_limit"
                name="female_upper_limit"
                value={formData.female_upper_limit}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                step="any"
              />
            </div>
          </div>
          <div>
            <label htmlFor="reference_notes" className="block mb-1 font-medium">Reference Notes</label>
            <textarea
              id="reference_notes"
              name="reference_notes"
              value={formData.reference_notes}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="3"
            ></textarea>
          </div>
          <div>
            <label htmlFor="order" className="block mb-1 font-medium">Order</label>
            <input
              type="number"
              id="order"
              name="order"
              value={formData.order}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              min="0"
            />
          </div>
          {errors.submit && <p className="text-red-500 text-sm mb-4">{errors.submit}</p>}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : (initialData ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default withAuth(LabTestFormatModal);