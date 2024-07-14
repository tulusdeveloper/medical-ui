"use client"
import { visitTypeApi } from '@/utils/api';
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const VisitTypeModal = ({ isOpen, onClose, onSuccess, initialData = null, insurances }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'CASH',
    insurance: null,
    is_active: true,
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
          type: 'CASH',
          insurance: null,
          is_active: true,
        });
      }
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = "Name is required";
    if (formData.type === 'INSURANCE' && !formData.insurance) tempErrors.insurance = "Insurance is required for insurance type";
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
          await visitTypeApi.updateVisitType(initialData.id, formData);
        } else {
          await visitTypeApi.createVisitType(formData);
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
    if (window.confirm('Are you sure you want to delete this visit type?')) {
      setIsLoading(true);
      try {
        await visitTypeApi.deleteVisitType(initialData.id);
        onSuccess();
        handleClose();
      } catch (error) {
        console.error('Error deleting visit type:', error);
        setErrors({ submit: 'An error occurred while deleting. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      type: 'CASH',
      insurance: null,
      is_active: true,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{initialData ? 'Edit' : 'Add'} Visit Type</h2>
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
            <label htmlFor="type" className="block mb-2 font-medium">Type</label>
            <select
              name="type"
              id="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="CASH">Cash</option>
              <option value="INSURANCE">Insurance</option>
            </select>
          </div>
          {formData.type === 'INSURANCE' && (
            <div className="mb-4">
              <label htmlFor="insurance" className="block mb-2 font-medium">Insurance</label>
              <select
                name="insurance"
                id="insurance"
                value={formData.insurance}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Insurance</option>
                {insurances.map((insurance) => (
                  <option key={insurance.id} value={insurance.id}>{insurance.name}</option>
                ))}
              </select>
              {errors.insurance && <p className="text-red-500 text-sm mt-1">{errors.insurance}</p>}
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="is_active" className="flex items-center">
              <input
                type="checkbox"
                name="is_active"
                id="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="mr-2"
              />
              <span>Is Active</span>
            </label>
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

export default VisitTypeModal;