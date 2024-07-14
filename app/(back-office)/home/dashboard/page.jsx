// pages/dashboard.js
"use client"
import React, { useState, useEffect } from 'react';
import { 
  laboratoryApi, 
  patientsApi, 
  insuranceApi, 
  visitTypeApi 
} from '@/utils/api';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend
} from 'recharts';
import withAuth from '@/utils/withAuth';

const Dashboard = () => {
  const [labStats, setLabStats] = useState({});
  const [patientStats, setPatientStats] = useState({});
  const [insuranceStats, setInsuranceStats] = useState({});
  const [visitTypeStats, setVisitTypeStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [labClasses, patients, insurances, visitTypes] = await Promise.all([
          laboratoryApi.fetchLabTestClasses(),
          patientsApi.fetchPatients(),
          insuranceApi.fetchInsurances(),
          visitTypeApi.fetchVisitTypes()
        ]);

        setLabStats({
          totalClasses: labClasses.data.length,
        });

        setPatientStats({
          totalPatients: patients.data.length,
          genderDistribution: calculateGenderDistribution(patients.data),
        });

        setInsuranceStats({
          totalInsurances: insurances.data.length,
        });

        setVisitTypeStats({
          totalVisitTypes: visitTypes.data.length,
        });

        setLoading(false);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const calculateGenderDistribution = (patients) => {
    const distribution = patients.reduce((acc, patient) => {
      acc[patient.gender] = (acc[patient.gender] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(distribution).map(([gender, count]) => ({ gender, count }));
  };

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="dashboard">
      <h1>MediCare Dashboard</h1>
      
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Laboratory Statistics</h2>
          <p>Total Lab Test Classes: {labStats.totalClasses}</p>
        </div>

        <div className="dashboard-card">
          <h2>Patient Statistics</h2>
          <p>Total Patients: {patientStats.totalPatients}</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={patientStats.genderDistribution}
                dataKey="count"
                nameKey="gender"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {patientStats.genderDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28'][index % 3]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard-card">
          <h2>Insurance Statistics</h2>
          <p>Total Insurances: {insuranceStats.totalInsurances}</p>
        </div>

        <div className="dashboard-card">
          <h2>Visit Type Statistics</h2>
          <p>Total Visit Types: {visitTypeStats.totalVisitTypes}</p>
        </div>
      </div>

      <style jsx>{`
        .dashboard {
          padding: 20px;
        }
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }
        .dashboard-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 20px;
        }
      `}</style>
    </div>
  );
};

export default withAuth(Dashboard);