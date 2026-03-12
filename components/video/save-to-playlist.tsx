'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/components/auth/auth-provider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, ListVideo, Loader2, FolderPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SaveToPlaylistProps {
  videoId: string;
}

export function SaveToPlaylist({ videoId }: SaveToPlaylistProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState({ name: '', description: '' });

  const fetchPlaylists = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const response = await api.get<any>(`/playlist/user/${user._id}`);
      setPlaylists(response.data || []);
    } catch (error) {
      console.error('Failed to fetch playlists', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleVideo = async (playlistId: string, isInPlaylist: boolean) => {
    try {
      if (isInPlaylist) {
        await api.patch(`/playlist/remove/${videoId}/${playlistId}`);
        toast({ title: 'Success', description: 'Removed from playlist.' });
      } else {
        await api.patch(`/playlist/add/${videoId}/${playlistId}`);
        toast({ title: 'Success', description: 'Added to playlist.' });
      }
      fetchPlaylists();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to update playlist.', variant: 'destructive' });
    }
  };

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylist.name.trim()) return;

    setIsCreating(true);
    try {
      const response = await api.post<any>('/playlist', newPlaylist);
      const playlistId = response.data._id;
      
      // Auto-add video to new playlist
      await api.patch(`/playlist/add/${videoId}/${playlistId}`);
      
      toast({ title: 'Success', description: 'Playlist created and video added!' });
      setNewPlaylist({ name: '', description: '' });
      setShowCreate(false);
      fetchPlaylists();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to create playlist.', variant: 'destructive' });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog onOpenChange={(open) => open && fetchPlaylists()}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="rounded-full text-white hover:bg-white/10 space-x-2">
          <ListVideo className="h-4 w-4" />
          <span>Save</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-slate-900 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <ListVideo className="h-5 w-5 text-blue-500" />
            <span>Save to playlist</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <ScrollArea className="h-48 pr-4">
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
              </div>
            ) : playlists.length > 0 ? (
              <div className="space-y-3">
                {playlists.map((playlist) => {
                  const isInPlaylist = playlist.videos?.includes(videoId);
                  return (
                    <div key={playlist._id} className="flex items-center space-x-3 rounded-lg p-2 hover:bg-white/5 transition-colors">
                      <Checkbox 
                        id={playlist._id} 
                        checked={isInPlaylist}
                        onCheckedChange={() => handleToggleVideo(playlist._id, isInPlaylist)}
                        className="border-white/20 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                      <label 
                        htmlFor={playlist._id}
                        className="flex-1 text-sm font-medium leading-none cursor-pointer"
                      >
                        {playlist.name}
                      </label>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-2">
                <FolderPlus className="h-8 w-8 opacity-20" />
                <p className="text-sm">No playlists found</p>
              </div>
            )}
          </ScrollArea>

          <div className="pt-2 border-t border-white/10">
            {!showCreate ? (
              <Button 
                variant="ghost" 
                className="w-full justify-start text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 px-2"
                onClick={() => setShowCreate(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create new playlist
              </Button>
            ) : (
              <form onSubmit={handleCreatePlaylist} className="space-y-4 pt-2">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-xs text-slate-400 uppercase tracking-wider font-bold">Name</Label>
                  <Input 
                    id="name"
                    placeholder="Enter playlist name"
                    value={newPlaylist.name}
                    onChange={(e) => setNewPlaylist({ ...newPlaylist, name: e.target.value })}
                    className="bg-black/40 border-white/10 focus:border-blue-500 text-white"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="desc" className="text-xs text-slate-400 uppercase tracking-wider font-bold">Description</Label>
                  <Input 
                    id="desc"
                    placeholder="Enter description"
                    value={newPlaylist.description}
                    onChange={(e) => setNewPlaylist({ ...newPlaylist, description: e.target.value })}
                    className="bg-black/40 border-white/10 focus:border-blue-500 text-white"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setShowCreate(false)}>Cancel</Button>
                  <Button 
                    type="submit" 
                    size="sm" 
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={isCreating || !newPlaylist.name.trim()}
                  >
                    {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
