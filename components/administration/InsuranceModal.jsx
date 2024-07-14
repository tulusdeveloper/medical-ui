"use client"
import { insuranceApi } from '@/utils/api';
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const InsuranceModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    policy_number: '',
    coverage_details: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData(initialData);
      } else {
        setFormData({
          name: '',
          policy_number: '',
          coverage_details: '',
        });
      }
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = "Name is required";
    if (!formData.policy_number.trim()) tempErrors.policy_number = "Policy number is required";
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
          await insuranceApi.updateInsurance(initialData.id, formData);
        } else {
          await insuranceApi.createInsurance(formData);
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

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this insurance?')) {
      setIsLoading(true);
      try {
        await insuranceApi.deleteInsurance(initialData.id);
        onSuccess();
        handleClose();
      } catch (error) {
        console.error('Error deleting insurance:', error);
        setErrors({ submit: 'An error occurred while deleting. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      policy_number: '',
      coverage_details: '',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{initialData ? 'Edit' : 'Add'} Insurance</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2 font-medium">Name</label>
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
          <div className="mb-4">
            <label htmlFor="policy_number" className="block mb-2 font-medium">Policy Number</label>
            <input
              type="text"
              id="policy_number"
              name="policy_number"
              value={formData.policy_number}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            {errors.policy_number && <p className="text-red-500 text-sm mt-1">{errors.policy_number}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="coverage_details" className="block mb-2 font-medium">Coverage Details</label>
            <textarea
              id="coverage_details"
              name="coverage_details"
              value={formData.coverage_details}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="3"
            ></textarea>
          </div>
          {errors.submit && <p className="text-red-500 text-sm mb-4">{errors.submit}</p>}
          <div className="flex justify-between items-center">
            {initialData && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
            )}
            <div className="flex space-x-4">
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default InsuranceModal;