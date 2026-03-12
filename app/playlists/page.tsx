'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/components/auth/auth-provider';
import { motion } from 'framer-motion';
import { Loader2, ListVideo, Plus, FolderHeart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function PlaylistsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [newPlaylist, setNewPlaylist] = useState({ name: '', description: '' });
  const [isCreating, setIsCreating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPlaylists = async () => {
    setIsLoading(true);
    try {
      if (!user) return;
      const response = await api.get<any>(`/playlist/user/${user._id}`);
      setPlaylists(response.data || []);
    } catch (error) {
      console.error('Failed to fetch playlists', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchPlaylists();
    else setIsLoading(false);
  }, [user]);

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylist.name.trim()) return;

    setIsCreating(true);
    try {
      await api.post('/playlist', newPlaylist);
      toast({ title: 'Success', description: 'Playlist created successfully!' });
      setNewPlaylist({ name: '', description: '' });
      setIsModalOpen(false);
      fetchPlaylists();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to create playlist.', variant: 'destructive' });
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
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
          <FolderHeart className="h-12 w-12 text-blue-500" />
        </div>
        <h2 className="text-2xl font-bold text-white">Sign in to see your playlists</h2>
        <Link href="/login">
          <Button className="bg-blue-600 hover:bg-blue-700 mt-4 rounded-full px-8 font-bold">Sign In</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 pt-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col space-y-2">
          <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center">
            <ListVideo className="mr-3 h-8 w-8 text-blue-500" />
            My Playlists
          </h1>
          <p className="text-slate-400 text-lg">Organize and Manage your collections</p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 rounded-full font-bold px-6 shadow-lg shadow-blue-500/20">
              <Plus className="mr-2 h-5 w-5" /> New Playlist
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-white/10 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black uppercase tracking-tighter">Create Playlist</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreatePlaylist} className="space-y-4 pt-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-xs text-slate-400 uppercase tracking-wider font-bold">Playlist Name</Label>
                <Input 
                  id="name"
                  placeholder="Enter playlist name"
                  value={newPlaylist.name}
                  onChange={(e) => setNewPlaylist({ ...newPlaylist, name: e.target.value })}
                  className="bg-black/40 border-white/10 focus:border-blue-500 text-white h-12"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="desc" className="text-xs text-slate-400 uppercase tracking-wider font-bold">Description</Label>
                <Textarea 
                  id="desc"
                  placeholder="Enter description"
                  value={newPlaylist.description}
                  onChange={(e) => setNewPlaylist({ ...newPlaylist, description: e.target.value })}
                  className="bg-black/40 border-white/10 focus:border-blue-500 text-white"
                  rows={3}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg font-bold"
                disabled={isCreating || !newPlaylist.name.trim()}
              >
                {isCreating ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create Playlist'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {playlists.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {playlists.map((playlist, index) => (
            <motion.div
              key={playlist._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/playlist/${playlist._id}`} className="group block space-y-3">
                <div className="aspect-video relative overflow-hidden rounded-2xl border border-white/10 group-hover:ring-2 ring-blue-500/50 transition-all shadow-xl">
                  {/* Playlist Stack Effect */}
                  <div className="absolute inset-0 bg-slate-900" />
                  {playlist.videos?.[0]?.thumbnail ? (
                    <Image
                      src={playlist.videos[0].thumbnail}
                      alt={playlist.name}
                      fill
                      className="object-cover opacity-60 transition-transform duration-500 group-hover:scale-110"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-800">
                      <ListVideo className="h-12 w-12 text-slate-600" />
                    </div>
                  )}
                  
                  {/* Playlist Side Overlay */}
                  <div className="absolute inset-y-0 right-0 w-1/3 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center border-l border-white/10 space-y-1">
                    <span className="text-2xl font-black text-white">{playlist.videos?.length || 0}</span>
                    <ListVideo className="h-5 w-5 text-slate-300" />
                  </div>
                  
                  {/* Bottom Gradient for Name */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <div className="space-y-1 px-1">
                  <h3 className="font-bold text-white text-lg leading-tight group-hover:text-blue-400 transition-colors truncate">
                    {playlist.name}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-1">{playlist.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex h-60 flex-col items-center justify-center space-y-4 rounded-3xl border border-dashed border-white/10 bg-white/5 p-12 text-center">
          <FolderHeart className="h-12 w-12 text-slate-500" />
          <div className="space-y-1">
             <h3 className="text-xl font-bold text-white">No playlists yet</h3>
             <p className="text-slate-400">Create your first playlist to start organizing videos!</p>
          </div>
          <Button 
            className="mt-4 bg-blue-600 hover:bg-blue-700 rounded-full px-8"
            onClick={() => setIsModalOpen(true)}
          >
            Create Playlist
          </Button>
        </div>
      )}
    </div>
  );
}
