'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/components/auth/auth-provider';
import { motion } from 'framer-motion';
import { Loader2, Play, User, Bell, LayoutGrid } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

export default function SubscriptionsPage() {
  const { user } = useAuth();
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscribedVideos = async () => {
      try {
        const response = await api.get<any>('/videos/u/subscriptions');
        setVideos(response.data.docs || []);
      } catch (error) {
        console.error('Failed to fetch subscribed videos', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchSubscribedVideos();
    else setLoading(false);
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
        <div className="rounded-full bg-white/5 p-6 border border-white/10">
          <Bell className="h-12 w-12 text-blue-500" />
        </div>
        <h2 className="text-2xl font-bold text-white">Sign in to see your subscriptions</h2>
        <p className="text-slate-400">Videos from channels you subscribe to will appear here.</p>
        <Link href="/login">
          <Button className="bg-blue-600 hover:bg-blue-700 mt-4 rounded-full px-8 font-bold">Sign In</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 pt-4">
      <div className="flex flex-col space-y-2">
        <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center">
          <LayoutGrid className="mr-3 h-8 w-8 text-blue-500" />
          Subscriptions
        </h1>
        <p className="text-slate-400 text-lg">Latest videos from your favorite creators</p>
      </div>

      {videos.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {videos.map((video, index) => (
            <motion.div
              key={video._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="group"
            >
              <Link href={`/watch/${video._id}`} className="block space-y-4">
                <div className="aspect-video relative overflow-hidden rounded-2xl border border-white/10 shadow-lg transition-all group-hover:scale-[1.03] group-hover:shadow-blue-500/20 group-hover:ring-2 ring-blue-500/50">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    unoptimized
                  />
                  <div className="absolute bottom-3 right-3 rounded bg-black/80 px-2 py-1 text-xs font-bold text-white backdrop-blur-sm">
                    {Math.floor(video.duration / 60)}:{Math.floor(video.duration % 60).toString().padStart(2, '0')}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 bg-black/40 backdrop-blur-[2px]">
                    <div className="rounded-full bg-blue-600 p-4 shadow-xl">
                      <Play className="h-8 w-8 text-white fill-white" />
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <Link href={`/c/${video.owner?.username}`}>
                    <Avatar className="h-10 w-10 border border-white/10 ring-2 ring-transparent transition-all hover:ring-blue-500">
                      <AvatarImage src={video.owner?.avatar} />
                      <AvatarFallback className="bg-slate-800 text-white font-bold">
                        {video.owner?.username?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-bold text-white leading-tight line-clamp-2 group-hover:text-blue-400 transition-colors">
                      {video.title}
                    </h3>
                    <div className="flex flex-col text-sm text-slate-400">
                      <Link href={`/c/${video.owner?.username}`} className="hover:text-white transition-colors w-fit">
                        {video.owner?.fullName}
                      </Link>
                      <span>{video.views.toLocaleString()} views • {formatDistanceToNow(new Date(video.createdAt))} ago</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex h-60 flex-col items-center justify-center space-y-4 rounded-3xl border border-dashed border-white/10 bg-white/5 p-12 text-center">
          <User className="h-12 w-12 text-slate-500" />
          <div className="space-y-1">
             <h3 className="text-xl font-bold text-white">No videos yet</h3>
             <p className="text-slate-400">Start subscribing to channels to see their latest videos here!</p>
          </div>
          <Link href="/">
             <Button variant="outline" className="mt-4 border-white/10 text-white hover:bg-white/5 rounded-full px-8">Discover Channels</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
