import { Metadata } from 'next'
import DashboardHeader from '@/components/dashboard/dashboard-header'
import VideoList from '@/components/dashboard/video-list'

export const metadata: Metadata = {
  title: 'Dashboard - ViewTube',
  description: 'Manage your videos and channel',
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader />
      <VideoList />
    </div>
  )
}