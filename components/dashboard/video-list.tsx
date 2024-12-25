'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Edit2, Trash2 } from 'lucide-react'

const sampleVideos = [
  {
    id: '1',
    title: 'Building a Modern Web Application',
    views: '125K',
    likes: '10K',
    publishedAt: '2024-03-20',
    status: 'Published',
  },
  {
    id: '2',
    title: 'Advanced TypeScript Patterns',
    views: '89K',
    likes: '7.5K',
    publishedAt: '2024-03-18',
    status: 'Published',
  },
]

export default function VideoList() {
  const [videos, setVideos] = useState(sampleVideos)

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Views</TableHead>
            <TableHead>Likes</TableHead>
            <TableHead>Published</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {videos.map((video) => (
            <TableRow key={video.id}>
              <TableCell className="font-medium">{video.title}</TableCell>
              <TableCell>{video.views}</TableCell>
              <TableCell>{video.likes}</TableCell>
              <TableCell>{video.publishedAt}</TableCell>
              <TableCell>{video.status}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon">
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}