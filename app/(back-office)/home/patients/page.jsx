"use client"
import PatientList from '@/components/patientsl/PatientList'
import withAuth from '@/utils/withAuth'
import React from 'react'

function Patients() {
  return (
    <div>
      <PatientList />
    </div>
  )
}

export default withAuth(Patients)
