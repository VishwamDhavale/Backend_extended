'use client';

import { useEffect, useState, Suspense } from 'react';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import { Loader2, Search, SlidersHorizontal, Play, Clock } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const response = await api.get<any>(`/videos?query=${encodeURIComponent(query)}`);
        setVideos(response.data.docs || []);
      } catch (error) {
        console.error('Failed to fetch search results', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 pt-4 max-w-6xl mx-auto">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center space-x-3">
          <Search className="h-6 w-6 text-blue-500" />
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">
            {query ? `Results for "${query}"` : 'All Videos'}
          </h1>
        </div>
        <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5 rounded-full px-6">
          <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
        </Button>
      </div>

      {videos.length > 0 ? (
        <div className="space-y-6 pt-4">
          {videos.map((video, index) => (
            <motion.div
              key={video._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/watch/${video._id}`} className="group flex flex-col md:flex-row gap-6 p-4 rounded-3xl hover:bg-white/5 transition-all border border-transparent hover:border-white/10">
                <div className="aspect-video relative w-full md:w-80 flex-shrink-0 overflow-hidden rounded-2xl border border-white/10 transition-all group-hover:ring-2 ring-blue-500/50 shadow-xl">
                  <Image src={video.thumbnail} alt={video.title} fill className="object-cover transition-transform group-hover:scale-105" unoptimized />
                  <div className="absolute bottom-3 right-3 rounded bg-black/80 px-2 py-1 text-xs font-bold text-white backdrop-blur-sm">
                    {Math.floor(video.duration / 60)}:{Math.floor(video.duration % 60).toString().padStart(2, '0')}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 bg-black/40 backdrop-blur-[1px]">
                     <Play className="h-10 w-10 text-white fill-white" />
                  </div>
                </div>
                
                <div className="flex-1 space-y-3 py-1">
                  <h3 className="text-xl md:text-2xl font-bold text-white leading-tight group-hover:text-blue-400 transition-colors line-clamp-2">
                    {video.title}
                  </h3>
                  
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-7 w-7 border border-white/10">
                      <AvatarImage src={video.owner?.avatar} />
                      <AvatarFallback className="text-[10px]">{video.owner?.username?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                      {video.owner?.fullName}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-sm text-slate-400">
                      {video.views.toLocaleString()} views • {formatDistanceToNow(new Date(video.createdAt))} ago
                    </span>
                  </div>
                  
                  <p className="text-slate-500 line-clamp-2 text-sm md:text-base max-w-2xl leading-relaxed">
                    {video.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 bg-white/5 rounded-[40px] border border-white/10 border-dashed m-4">
          <div className="p-6 rounded-full bg-slate-900 border border-white/10 shadow-inner">
             <Search className="h-16 w-16 text-slate-700" />
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl font-black text-white">No videos found</h3>
            <p className="text-slate-500 max-w-sm">Try using different keywords or exploring trending videos.</p>
          </div>
          <Link href="/">
            <Button className="bg-blue-600 hover:bg-blue-700 rounded-full px-10 h-12 font-bold shadow-xl shadow-blue-500/20">
              Browse Home
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div className="flex h-[60vh] items-center justify-center text-white">Loading Search...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
