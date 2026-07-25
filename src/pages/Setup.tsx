import React from 'react'
import { Navigate } from 'react-router-dom'

/**
 * Setup Wizard Disabled
 * For security reasons, setup initialization via public web routes has been disabled.
 * Administrator roles are managed directly through database access or Supabase SQL Editor.
 */
export const Setup: React.FC = () => {
  return <Navigate to="/login" replace />
}

export default Setup
