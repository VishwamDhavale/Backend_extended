'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { formatDistanceToNow } from 'date-fns'

const sampleRelatedVideos = [
  {
    id: '3',
    title: 'Advanced React Patterns for Scalable Applications',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
    channel: 'React Masters',
    views: '50K',
    publishedAt: new Date('2024-03-15'),
  },
  {
    id: '4',
    title: 'Building Real-time Applications with WebSockets',
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479',
    channel: 'WebDev Pro',
    views: '32K',
    publishedAt: new Date('2024-03-14'),
  },
]

export default function RelatedVideos({ currentVideoId }: { currentVideoId: string }) {
  return (
    <div className="space-y-4">
      {sampleRelatedVideos.map((video) => (
        <Link key={video.id} href={`/watch/${video.id}`}>
          <Card className="flex space-x-4 p-2 hover:bg-muted/50 transition-colors">
            <div className="relative w-40 h-24">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="object-cover rounded-lg w-full h-full"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold line-clamp-2">{video.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{video.channel}</p>
              <div className="flex items-center text-sm text-muted-foreground">
                <span>{video.views} views</span>
                <span className="mx-1">•</span>
                <span>{formatDistanceToNow(video.publishedAt)} ago</span>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}