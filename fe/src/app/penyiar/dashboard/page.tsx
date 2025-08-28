"use client"

import { AdminLayout } from "@/components/layout"
import { OnAirPanel } from "@/components/live"

// Broadcaster Dashboard page: Main dashboard for on-air broadcasters
export default function BroadcasterDashboardPage() {
  return (
    <AdminLayout requiredRoles={['penyiar', 'admin']}>
      <OnAirPanel broadcasterName="Penyiar" />
    </AdminLayout>
  )
}