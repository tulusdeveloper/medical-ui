"use client"
import React, { useState, useEffect } from 'react';
import AdminDashboard from '@/components/administration/AdminDashboard';  // Adjust this path if necessary
import { insuranceApi, visitTypeApi, departmentApi } from '@/utils/api';
import withAuth from '@/utils/withAuth';

function SystemConfiguration() {
  const [counts, setCounts] = useState({
    insurances: 0,
    visitTypes: 0,
    departments: 0,
    userRoles: 0
  });

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const [
        insurancesResponse,
        visitTypesResponse,
        departmentResponse,
        // Add more API calls here when available
      ] = await Promise.all([
        insuranceApi.fetchInsurances(),
        visitTypeApi.fetchVisitTypes(),
        departmentApi.fetchDepartments(),
        // Add more API calls here when available
      ]);

      setCounts({
        insurances: insurancesResponse.data.length,
        visitTypes: visitTypesResponse.data.length,
        departments: departmentResponse.data.length, // Replace with actual count when API is available
        userRoles: 0, // Replace with actual count when API is available
      });
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  return (
    <div>
      <AdminDashboard counts={counts} />
    </div>
  );
}

export default withAuth(SystemConfiguration);