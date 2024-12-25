'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { ThumbsUp, ThumbsDown, Share2, Flag } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const sampleVideo = {
  title: 'Building a Modern Web Application',
  views: '125K',
  publishedAt: new Date('2024-03-20'),
  likes: '10K',
  channel: {
    name: 'Tech Tutorials',
    subscribers: '500K',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
  },
  description: 'Learn how to build a modern web application using the latest technologies...',
}

export default function VideoInfo({ videoId }: { videoId: string }) {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{sampleVideo.title}</h1>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-10 w-10">
            <img src={sampleVideo.channel.avatar} alt={sampleVideo.channel.name} />
          </Avatar>
          <div>
            <h3 className="font-semibold">{sampleVideo.channel.name}</h3>
            <p className="text-sm text-muted-foreground">{sampleVideo.channel.subscribers} subscribers</p>
          </div>
          <Button
            variant={isSubscribed ? "secondary" : "default"}
            onClick={() => setIsSubscribed(!isSubscribed)}
          >
            {isSubscribed ? 'Subscribed' : 'Subscribe'}
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="secondary" size="sm">
            <ThumbsUp className="h-4 w-4 mr-2" />
            {sampleVideo.likes}
          </Button>
          <Button variant="secondary" size="sm">
            <ThumbsDown className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="sm">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Flag className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center space-x-2 text-sm mb-2">
          <span>{sampleVideo.views} views</span>
          <span>•</span>
          <span>{formatDistanceToNow(sampleVideo.publishedAt)} ago</span>
        </div>
        <p className={showFullDescription ? '' : 'line-clamp-2'}>
          {sampleVideo.description}
        </p>
        <Button
          variant="link"
          className="px-0"
          onClick={() => setShowFullDescription(!showFullDescription)}
        >
          {showFullDescription ? 'Show less' : 'Show more'}
        </Button>
      </div>
    </div>
  )
}