import { DashboardProvider } from '../dashboard/context/DashboardContext'
import DashboardLayout from '../dashboard/DashboardLayout'

export default function DashboardPage() {
  return (
    <DashboardProvider>
      <DashboardLayout />
    </DashboardProvider>
  )
}
