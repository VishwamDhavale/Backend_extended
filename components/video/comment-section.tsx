'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'
import { ThumbsUp, ThumbsDown } from 'lucide-react'

const sampleComments = [
  {
    id: '1',
    user: {
      name: 'Alice Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    },
    content: 'Great tutorial! Very well explained.',
    likes: 245,
    timestamp: new Date('2024-03-19'),
    replies: [],
  },
  {
    id: '2',
    user: {
      name: 'Bob Smith',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
    },
    content: 'Thanks for sharing this knowledge!',
    likes: 123,
    timestamp: new Date('2024-03-18'),
    replies: [],
  },
]

export default function CommentSection({ videoId }: { videoId: string }) {
  const [comments, setComments] = useState(sampleComments)
  const [newComment, setNewComment] = useState('')

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const comment = {
      id: Date.now().toString(),
      user: {
        name: 'Current User',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
      },
      content: newComment,
      likes: 0,
      timestamp: new Date(),
      replies: [],
    }

    setComments([comment, ...comments])
    setNewComment('')
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{comments.length} Comments</h2>
      
      <form onSubmit={handleSubmitComment} className="flex space-x-4">
        <Avatar className="h-8 w-8">
          <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde" alt="Current user" />
        </Avatar>
        <div className="flex-1">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="mb-2"
          />
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="ghost" onClick={() => setNewComment('')}>
              Cancel
            </Button>
            <Button type="submit" disabled={!newComment.trim()}>
              Comment
            </Button>
          </div>
        </div>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex space-x-4">
            <Avatar className="h-8 w-8">
              <img src={comment.user.avatar} alt={comment.user.name} />
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-semibold">{comment.user.name}</span>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(comment.timestamp)} ago
                </span>
              </div>
              <p className="mt-1">{comment.content}</p>
              <div className="flex items-center space-x-4 mt-2">
                <Button variant="ghost" size="sm">
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  {comment.likes}
                </Button>
                <Button variant="ghost" size="sm">
                  <ThumbsDown className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  Reply
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}