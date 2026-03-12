'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { api } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Pencil, Trash2, ExternalLink, Globe, Lock, MoreVertical } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

export default function MyVideosPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [videos, setVideos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchMyVideos = async () => {
    try {
      if (!user) return;
      // Backend getAllVideos filter by userId
      const response = await api.get<any>(`/videos?userId=${user._id}`);
      setVideos(response.data.docs || []);
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to fetch your videos.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyVideos();
  }, [user]);

  const handleDelete = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    try {
      await api.delete(`/videos/${videoId}`);
      toast({ title: 'Success', description: 'Video deleted.' });
      fetchMyVideos();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to delete video.', variant: 'destructive' });
    }
  };

  const handleTogglePublish = async (videoId: string) => {
    setTogglingId(videoId);
    try {
      await api.patch(`/videos/toggle/publish/${videoId}`);
      toast({ title: 'Success', description: 'Video status updated.' });
      // Update local state for immediate feedback
      setVideos(prev => prev.map(v => 
        v._id === videoId ? { ...v, isPublished: !v.isPublished } : v
      ));
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to toggle status.', variant: 'destructive' });
    } finally {
      setTogglingId(null);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-8 pb-10 pt-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-white">My Videos</h1>
          <p className="text-slate-400">Manage your published content and channel library.</p>
        </div>
        <Link href="/upload">
          <Button className="bg-blue-600 hover:bg-blue-700">Add New Video</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex h-[40vh] items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="grid gap-6">
          {videos.map((video, index) => (
            <motion.div
              key={video._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="overflow-hidden border-white/10 bg-white/5 backdrop-blur-sm group hover:bg-white/10 transition-colors">
                <CardContent className="p-0 flex flex-col md:flex-row">
                  <div className="relative aspect-video w-full md:w-64 flex-shrink-0">
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{video.title}</h3>
                        <div className="flex items-center space-x-2">
                          <Link href={`/watch/${video._id}`}>
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/10" title="View Video">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>
                          
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-slate-400 hover:text-blue-400 hover:bg-blue-400/10"
                            onClick={() => toast({ title: 'Info', description: 'Edit functionality coming soon!' })}
                            title="Edit Video"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>

                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className={`${video.isPublished ? 'text-green-400 hover:bg-green-400/10' : 'text-yellow-400 hover:bg-yellow-400/10'} transition-colors`}
                            onClick={() => handleTogglePublish(video._id)}
                            disabled={togglingId === video._id}
                            title={video.isPublished ? "Make Private" : "Make Public"}
                          >
                            {togglingId === video._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : video.isPublished ? (
                              <Globe className="h-4 w-4" />
                            ) : (
                              <Lock className="h-4 w-4" />
                            )}
                          </Button>

                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-slate-400 hover:text-red-400 hover:bg-red-400/10"
                            onClick={() => handleDelete(video._id)}
                            title="Delete Video"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-slate-400 line-clamp-2">{video.description}</p>
                    </div>
                    <div className="mt-4 flex items-center space-x-6 text-xs text-slate-500">
                      <span>{video.views?.toLocaleString()} views</span>
                      <span>Published {new Date(video.createdAt).toLocaleDateString()}</span>
                      <span className={video.isPublished ? 'text-green-400' : 'text-yellow-400'}>
                        {video.isPublished ? 'Public' : 'Private'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {videos.length === 0 && (
            <div className="py-20 text-center border-2 border-dashed border-white/10 rounded-2xl">
              <p className="text-lg text-slate-500">You haven't uploaded any videos yet.</p>
              <Link href="/upload" className="mt-4 inline-block">
                <Button variant="outline" className="border-white/10 text-white">Start Creating</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
