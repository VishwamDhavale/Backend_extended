'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, Flame, Trophy, Music, Gamepad2, Radio, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { api } from '@/lib/api';

const categories = [
  { name: 'All', icon: null },
  { name: 'Trending', icon: Flame },
  { name: 'Gaming', icon: Gamepad2 },
  { name: 'Music', icon: Music },
  { name: 'Live', icon: Radio },
  { name: 'Sports', icon: Trophy },
];

export default function Home() {
  const [videos, setVideos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await api.get<any>('/videos');
        setVideos(response.data.docs || []);
      } catch (error) {
        console.error('Failed to fetch videos', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="space-y-8 pb-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50 p-8 md:p-12">
        <div className="relative z-10 max-w-2xl space-y-4">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-bold tracking-tight text-white md:text-5xl"
          >
            Discover the next <span className="text-blue-500">generation</span> of video sharing.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-400"
          >
            Explore millions of videos from creators around the world. Share your story with our high-end platform.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex space-x-3 pt-4"
          >
            <Button className="bg-blue-600 hover:bg-blue-700 h-12 px-8 text-lg font-bold">Get Started</Button>
            <Button variant="outline" className="h-12 px-8 text-lg border-white/10 hover:bg-white/5 text-white font-bold">Browse All</Button>
          </motion.div>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-20 blur-3xl bg-blue-600 rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute left-0 bottom-0 h-1/2 w-1/4 opacity-10 blur-3xl bg-indigo-600 rounded-full -translate-x-1/2 translate-y-1/2" />
      </section>

      {/* Categories */}
      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <Button 
            key={cat.name} 
            variant="ghost" 
            className="whitespace-nowrap rounded-full border border-white/5 bg-white/5 px-6 py-2 hover:bg-white/10 text-slate-300"
          >
            {cat.icon && <cat.icon className="mr-2 h-4 w-4" />}
            {cat.name}
          </Button>
        ))}
      </div>

      {/* Video Grid */}
      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {videos.map((video, index) => (
            <motion.div
              key={video._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/watch/${video._id}`} className="group block space-y-3">
                <div className="aspect-video relative overflow-hidden rounded-xl border border-white/10 ring-1 ring-white/5 transition-all group-hover:scale-[1.02] group-hover:ring-blue-500/50">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    unoptimized
                  />
                  <div className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
                    {video.duration ? `${Math.floor(video.duration / 60)}:${Math.floor(video.duration % 60).toString().padStart(2, '0')}` : '0:00'}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 bg-black/20 backdrop-blur-[2px]">
                    <Play className="h-12 w-12 text-white fill-white/20" />
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Avatar className="h-9 w-9 border border-white/10">
                    <AvatarImage src={video.owner?.avatar} alt={video.owner?.username} />
                    <AvatarFallback>{video.owner?.username?.[0]?.toUpperCase() || '?'}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="font-bold leading-tight text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                      {video.title}
                    </h3>
                    <div className="text-sm text-slate-400">
                      <p className="hover:text-white transition-colors">{video.owner?.fullName}</p>
                      <p>{video.views?.toLocaleString()} views</p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
          
          {!isLoading && videos.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <p className="text-xl text-slate-500">No videos found. Be the first to upload!</p>
              <Link href="/upload">
                <Button className="mt-4 bg-blue-600 hover:bg-blue-700">Upload Video</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}