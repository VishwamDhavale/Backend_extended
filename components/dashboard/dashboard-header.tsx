import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'
import Link from 'next/link'

export default function DashboardHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your videos and channel settings
        </p>
      </div>
      <Button asChild>
        <Link href="/upload">
          <Upload className="mr-2 h-4 w-4" />
          Upload Video
        </Link>
      </Button>
    </div>
  )
}