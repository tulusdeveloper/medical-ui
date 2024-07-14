"use client"
import React, { useState, useEffect } from 'react';
import LaboratoryDashboard from '@/components/laboratory/LaboratoryDashboard';
import { laboratoryApi } from '@/utils/api';
import withAuth from '@/utils/withAuth';

function LaboratorySetup() {
  const [counts, setCounts] = useState({
    labTestClasses: 0,
    labTests: 0,
    labTestFormats: 0,
    labOrders: 0,
    labResults: 0
  });

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const [
        labTestClassesResponse,
        labTestsResponse,
        labTestFormatsResponse,
        labOrdersResponse,
        labResultsResponse
      ] = await Promise.all([
        laboratoryApi.fetchLabTestClasses(),
        laboratoryApi.fetchLabTests(),
        laboratoryApi.fetchLabTestFormats(),
        laboratoryApi.fetchLabOrders(),
        laboratoryApi.fetchLabResults()
      ]);

      setCounts({
        labTestClasses: labTestClassesResponse.data.length,
        labTests: labTestsResponse.data.length,
        labTestFormats: labTestFormatsResponse.data.length,
        labOrders: labOrdersResponse.data.length,
        labResults: labResultsResponse.data.length
      });
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  return (
    <div>
      <LaboratoryDashboard counts={counts} />
    </div>
  );
}

export default withAuth(LaboratorySetup);