import React from 'react';
import Link from 'next/link';
import { Shield, Users, Building, UserCheck } from 'lucide-react';

const adminModules = [
  { text: "Insurance", href: "/home/administration/insurance", icon: Shield, apiPath: "insurances" },
  { text: "Visit Types", href: "/home/administration/visit-types", icon: Users, apiPath: "visitTypes" },
  { text: "Departments", href: "/home/administration/departments", icon: Building, apiPath: "departments" },
  { text: "User Roles", href: "/home/administration/user-roles", icon: UserCheck, apiPath: "userRoles" },
];
export default function AdminDashboard({ counts }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">System Configuration</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminModules.map((module, index) => {
          const Icon = module.icon;
          const count = counts[module.apiPath] ?? 'Loading...';
          return (
            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Icon className="w-8 h-8 text-blue-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-800">{module.text}</h3>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">{count}</span>
                </div>
                <p className="text-gray-600 mb-4">Manage and view all {module.text.toLowerCase()}.</p>
                <div className="flex justify-between items-center">
                  <Link href={module.href} className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                    View All
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}