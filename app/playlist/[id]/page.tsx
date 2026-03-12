'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/components/auth/auth-provider';
import { motion } from 'framer-motion';
import { Loader2, Play, ListVideo, Clock, Share2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export default function PlaylistDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [playlist, setPlaylist] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [removingVideoId, setRemovingVideoId] = useState<string | null>(null);

  const fetchPlaylist = async () => {
    try {
      const response = await api.get<any>(`/playlist/${id}`);
      setPlaylist(response.data);
    } catch (error) {
      console.error('Failed to fetch playlist', error);
      toast({ title: 'Error', description: 'Playlist not found.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchPlaylist();
  }, [id]);

  const handleDeletePlaylist = async () => {
    if (!confirm('Are you sure you want to delete this playlist?')) return;
    setIsDeleting(true);
    try {
      await api.delete(`/playlist/${id}`);
      toast({ title: 'Success', description: 'Playlist deleted.' });
      router.push('/playlists');
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to delete playlist.', variant: 'destructive' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRemoveVideo = async (videoId: string) => {
    setRemovingVideoId(videoId);
    try {
      await api.patch(`/playlist/remove/${videoId}/${id}`);
      toast({ title: 'Success', description: 'Video removed from playlist.' });
      fetchPlaylist();
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to remove video.', variant: 'destructive' });
    } finally {
      setRemovingVideoId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Playlist not found</h2>
        <Button onClick={() => router.push('/playlists')}>Back to Playlists</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 pb-20 pt-4">
      {/* Sidebar Info */}
      <div className="w-full lg:w-96 flex-shrink-0">
        <div className="sticky top-24 space-y-6">
          <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
            {playlist.videos?.[0]?.thumbnail ? (
              <Image src={playlist.videos[0].thumbnail} alt={playlist.name} fill className="object-cover" unoptimized />
            ) : (
              <div className="h-full w-full bg-slate-800 flex items-center justify-center">
                 <ListVideo className="h-16 w-16 text-slate-600" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 flex items-center space-x-2 text-white font-bold">
               <ListVideo className="h-5 w-5" />
               <span>{playlist.videos?.length || 0} videos</span>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-black text-white leading-tight">{playlist.name}</h1>
            <p className="text-slate-400 font-medium leading-relaxed">{playlist.description}</p>
            
            <div className="flex items-center space-x-4 pt-2">
               <Avatar className="h-10 w-10 border border-white/10">
                  <AvatarImage src={playlist.owner?.avatar} />
                  <AvatarFallback>{playlist.owner?.username?.[0]?.toUpperCase()}</AvatarFallback>
               </Avatar>
               <div className="flex flex-col">
                  <span className="font-bold text-white">{playlist.owner?.fullName}</span>
                  <span className="text-xs text-slate-500">@{playlist.owner?.username}</span>
               </div>
            </div>

            <div className="flex space-x-2 pt-4">
               <Button className="flex-1 bg-white text-slate-900 hover:bg-slate-200 font-bold rounded-full">
                  <Play className="mr-2 h-4 w-4 fill-slate-900" /> Play All
               </Button>
               <Button variant="ghost" size="icon" className="rounded-full border border-white/10 bg-white/5 text-white">
                  <Share2 className="h-4 w-4" />
               </Button>
               {user?._id === playlist.owner?._id && (
                  <Button variant="ghost" size="icon" className="rounded-full border border-red-500/30 bg-red-500/10 text-red-500 hover:bg-red-500/20">
                     <Trash2 className="h-4 w-4" />
                  </Button>
               )}
            </div>
          </div>
        </div>
      </div>

      {/* Videos List */}
      <div className="flex-1 space-y-4">
        {playlist.videos && playlist.videos.length > 0 ? (
          playlist.videos.map((video: any, index: number) => (
            <motion.div
              key={video._id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/watch/${video._id}?list=${playlist._id}`} className="group flex items-center space-x-4 rounded-2xl p-3 hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                <span className="text-slate-500 font-bold w-4 text-center">{index + 1}</span>
                <div className="aspect-video relative w-40 overflow-hidden rounded-xl border border-white/10 flex-shrink-0">
                  <Image src={video.thumbnail} alt={video.title} fill className="object-cover" unoptimized />
                  <div className="absolute bottom-1.5 right-1.5 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {Math.floor(video.duration / 60)}:{Math.floor(video.duration % 60).toString().padStart(2, '0')}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white line-clamp-1 group-hover:text-blue-400 transition-colors uppercase tracking-tight text-sm">
                    {video.title}
                  </h3>
                  <div className="flex items-center space-x-2 text-xs text-slate-400 mt-1">
                    <span>{video.owner?.fullName || playlist.owner?.fullName}</span>
                    <span>•</span>
                    <Clock className="h-3 w-3" />
                  </div>
                </div>
                {user?._id === playlist.owner?._id && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-500 transition-opacity"
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemoveVideo(video._id);
                    }}
                    disabled={removingVideoId === video._id}
                  >
                    {removingVideoId === video._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </Button>
                )}
              </Link>
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-3xl border border-white/10">
             <ListVideo className="h-12 w-12 text-slate-600 mb-4" />
             <p className="text-slate-400">No videos in this playlist yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
