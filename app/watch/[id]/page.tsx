'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Share2, MoreHorizontal, MessageSquare, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { useAuth } from '@/components/auth/auth-provider';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import VideoPlayer from '@/components/video/video-player';
import { SaveToPlaylist } from '@/components/video/save-to-playlist';

export default function WatchPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  
  const [video, setVideo] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  const fetchVideoDetails = async () => {
    try {
      const response = await api.get<any>(`/videos/${id}`);
      setVideo(response.data);
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to load video.', variant: 'destructive' });
    }
  };

  const fetchComments = async () => {
    try {
      const response = await api.get<any>(`/comments/${id}`);
      setComments(response.data.docs || []);
    } catch (error: any) {
      console.error('Failed to fetch comments', error);
    }
  };

  useEffect(() => {
    if (id) {
      Promise.all([fetchVideoDetails(), fetchComments()]).finally(() => setIsLoading(false));
    }
  }, [id]);

  const handleLike = async () => {
    if (!user) return router.push('/login');
    setIsLiking(true);
    try {
      const response = await api.post<any>(`/likes/toggle/v/${id}`);
      const { isLiked, likesCount } = response.data;
      
      setVideo((prev: any) => ({
        ...prev,
        isLiked,
        likesCount
      }));
      
      toast({ title: 'Success', description: isLiked ? 'Video liked!' : 'Video unliked.' });
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to update like.', variant: 'destructive' });
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: 'Link Copied',
      description: 'Video URL has been copied to clipboard.',
    });
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return router.push('/login');
    if (!newComment.trim()) return;

    setIsCommenting(true);
    try {
      await api.post(`/comments/${id}`, { content: newComment });
      setNewComment('');
      fetchComments();
      fetchVideoDetails(); // Refresh stats like counts
      toast({ title: 'Success', description: 'Comment posted.' });
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to post comment.', variant: 'destructive' });
    } finally {
      setIsCommenting(false);
    }
  };

  const handleToggleSubscription = async () => {
    if (!user) return router.push('/login');
    if (!video?.owner?._id) return;

    setIsSubscribing(true);
    try {
      const response = await api.post<any>(`/subscriptions/c/${video.owner._id}`);
      const { isSubscribed } = response.data;
      
      setVideo((prev: any) => ({
        ...prev,
        isSubscribed
      }));
      
      toast({ 
        title: 'Success', 
        description: isSubscribed ? `Subscribed to ${video.owner.fullName}` : `Unsubscribed from ${video.owner.fullName}` 
      });
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to update subscription.', variant: 'destructive' });
    } finally {
      setIsSubscribing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Video not found</h2>
        <Button onClick={() => router.push('/')}>Go Home</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row pb-20 pt-6">
      <div className="flex-1 space-y-4">
        {/* Real Video Player */}
        <VideoPlayer 
          src={video.videoFile} 
          poster={video.thumbnail} 
        />

        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-white">{video.title}</h1>
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10 border border-white/10">
                <AvatarImage src={video.owner.avatar} />
                <AvatarFallback>{video.owner.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold text-white">{video.owner.fullName}</p>
                <p className="text-xs text-slate-400">@{video.owner.username}</p>
              </div>
              <Button 
                onClick={handleToggleSubscription}
                disabled={isSubscribing || (user?._id === video.owner?._id)}
                className={`ml-4 rounded-full px-6 font-bold transition-all ${
                  video.isSubscribed 
                    ? 'bg-white/10 text-white hover:bg-white/20' 
                    : 'bg-white text-slate-900 hover:bg-slate-200 shadow-lg shadow-white/10'
                }`}
              >
                {isSubscribing ? (
                  <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                ) : video.isSubscribed ? (
                  'Subscribed'
                ) : (
                  'Subscribe'
                )}
              </Button>
            </div>
            
            <div className="flex items-center space-x-2 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-sm">
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLike}
                  disabled={isLiking}
                  className={`rounded-l-full px-4 hover:bg-white/10 transition-colors ${video.isLiked ? 'text-blue-500' : 'text-white'}`}
                >
                  <ThumbsUp className={`mr-2 h-4 w-4 ${isLiking ? 'animate-pulse' : ''} ${video.isLiked ? 'fill-blue-500' : ''}`} /> 
                  {video.likesCount || 0}
                </Button>
                <Separator orientation="vertical" className="h-6 bg-white/10" />
                <Button variant="ghost" size="sm" className="rounded-r-full px-4 hover:bg-white/10 text-white">
                  <ThumbsDown className="h-4 w-4" />
                </Button>
              </div>

              <Separator orientation="vertical" className="h-6 bg-white/10" />

              <SaveToPlaylist videoId={video._id} />

              <Separator orientation="vertical" className="h-6 bg-white/10" />
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleShare}
                className="rounded-full px-4 hover:bg-white/10 text-white"
              >
                <Share2 className="mr-2 h-4 w-4" /> Share
              </Button>
              <Button variant="ghost" size="sm" className="rounded-full px-2 hover:bg-white/10 text-white">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <p className="text-sm font-bold text-white">
              {video.views?.toLocaleString()} views • {formatDistanceToNow(new Date(video.createdAt))} ago
            </p>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{video.description}</p>
          </div>
        </div>

        {/* Dynamic Comments Section */}
        <div className="pt-10">
          <h3 className="text-xl font-black text-white mb-8 flex items-center uppercase tracking-wider">
            <MessageSquare className="mr-3 h-6 w-6 text-blue-500 fill-blue-500/20" />
            {video.commentsCount || comments.length} Comments
          </h3>

          {user && (
            <form onSubmit={handleAddComment} className="flex items-start space-x-4 mb-10">
              <Avatar className="h-9 w-9 border border-white/10">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 relative">
                <Input
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="bg-transparent border-b border-white/10 rounded-none focus:border-blue-500 px-0 h-10 transition-colors text-white"
                />
                <div className="absolute right-0 bottom-0 mb-1 flex items-center space-x-2">
                  <Button 
                    type="submit" 
                    size="sm" 
                    disabled={isCommenting || !newComment.trim()}
                    className="h-8 rounded-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isCommenting ? <Loader2 className="h-4 w-4 animate-spin text-white" /> : <Send className="h-4 w-4 text-white" />}
                  </Button>
                </div>
              </div>
            </form>
          )}

          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {comments.map((comment) => (
                <motion.div 
                  key={comment._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-start space-x-4"
                >
                  <Avatar className="h-9 w-9 border border-white/10">
                    <AvatarImage src={comment.owner.avatar} />
                    <AvatarFallback>{comment.owner.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="font-bold text-white">@{comment.owner.username}</span>
                      <span className="text-slate-500">{formatDistanceToNow(new Date(comment.createdAt))} ago</span>
                    </div>
                    <p className="text-sm text-slate-300">{comment.content}</p>
                    <div className="flex items-center space-x-4 pt-2">
                      <Button variant="ghost" size="sm" className="h-8 px-2 text-slate-400 hover:text-white">
                        <ThumbsUp className="h-3 w-3 mr-1" /> 0
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 px-2 text-slate-400 hover:text-white">Reply</Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {comments.length === 0 && (
              <p className="text-center text-slate-500 py-10">No comments yet. Be the first to start the conversation!</p>
            )}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-80 space-y-4">
        <h3 className="text-lg font-bold text-white mb-4">Recommended</h3>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex space-x-2 group cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-colors">
            <div className="relative aspect-video w-32 flex-shrink-0 overflow-hidden rounded-lg border border-white/10">
              <div className="h-full w-full bg-slate-800 animate-pulse" />
            </div>
            <div className="space-y-1 overflow-hidden">
              <p className="text-sm font-bold leading-tight text-white group-hover:text-blue-400 transition-colors line-clamp-2">More Content from creators</p>
              <p className="text-xs text-slate-400">Recommended for you</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
