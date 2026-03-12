"use client"
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/components/auth/auth-provider';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { useParams, useRouter } from 'next/navigation';
import { Play, MessageSquare, ListVideo, Info, Loader2, UserPlus, UserCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface ChannelProfile {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  coverImage: string;
  subscribersCount: number;
  channelsSubscribedToCount: number;
  isSubscribed: boolean;
  createdAt: string;
}

export default function ChannelPage() {
  const { username } = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const { toast } = useToast();

  const [profile, setProfile] = useState<ChannelProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubscribing, setIsSubscribing] = useState(false);

  // Tab Data
  const [videos, setVideos] = useState<any[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [tweets, setTweets] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('videos');

  const fetchProfile = async () => {
    try {
      const response = await api.get<any>(`/users/c/${username}`);
      setProfile(response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch profile', error);
      toast({ title: 'Error', description: 'Failed to load channel.', variant: 'destructive' });
      return null;
    }
  };

  const fetchChannelData = async (userId: string) => {
    try {
      const [vRes, pRes, tRes] = await Promise.all([
        api.get<any>(`/videos?userId=${userId}`),
        api.get<any>(`/playlist/user/${userId}`),
        api.get<any>(`/tweets/user/${userId}`)
      ]);
      setVideos(vRes.data.docs || []);
      setPlaylists(pRes.data || []);
      setTweets(tRes.data || []);
    } catch (error) {
      console.error('Failed to fetch channel data', error);
    }
  };

  useEffect(() => {
    if (username) {
      setLoading(true);
      fetchProfile().then((v) => {
        if (v) fetchChannelData(v._id);
        setLoading(false);
      });
    }
  }, [username]);

  const handleToggleSubscription = async () => {
    if (!currentUser) return router.push('/login');
    if (!profile) return;

    setIsSubscribing(true);
    try {
      await api.post(`/subscriptions/c/${profile._id}`);
      // Refresh only the subscription part
      const updatedProfile = await fetchProfile();
      if (updatedProfile) {
        toast({
          title: updatedProfile.isSubscribed ? 'Subscribed!' : 'Unsubscribed',
          description: updatedProfile.isSubscribed ? `You've subscribed to ${profile.fullName}` : `You've unsubscribed from ${profile.fullName}`
        });
      }
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to update subscription.', variant: 'destructive' });
    } finally {
      setIsSubscribing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Channel not found</h2>
        <Button onClick={() => router.push('/')}>Go Home</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 pt-2">
      {/* Cover Image */}
      <div className="relative h-48 w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900 md:h-64 shadow-2xl">
        {profile.coverImage ? (
          <Image
            src={profile.coverImage}
            alt="Cover"
            fill
            className="object-cover opacity-60"
            priority
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-slate-800 to-blue-900/30" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>

      {/* Profile Header */}
      <div className="relative flex flex-col items-start px-6 md:flex-row md:items-end md:space-x-8">
        <div className="relative -mt-16 md:-mt-20">
          <Avatar className="h-32 w-32 border-4 border-background shadow-2xl md:h-44 md:w-44 ring-1 ring-white/10">
            <AvatarImage src={profile.avatar} alt={profile.username} />
            <AvatarFallback className="text-4xl bg-slate-800 text-white">
              {profile.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 mt-4 md:mt-0 pb-2">
          <h1 className="text-3xl font-bold text-white md:text-4xl">{profile.fullName}</h1>
          <div className="flex flex-wrap items-center space-x-2 text-slate-400 mt-1">
            <span className="font-semibold text-white">@{profile.username}</span>
            <span>•</span>
            <span>{profile.subscribersCount} subscribers</span>
            <span>•</span>
            <span>{videos.length} videos</span>
          </div>
        </div>

        <div className="mt-6 md:mt-0 flex space-x-3 pb-2">
          {currentUser?.username === profile.username ? (
            <Button className="bg-white text-slate-900 hover:bg-slate-200 font-bold rounded-full px-6" onClick={() => router.push('/settings')}>
              Customize Channel
            </Button>
          ) : (
            <Button
              disabled={isSubscribing}
              onClick={handleToggleSubscription}
              className={`rounded-full px-8 font-bold transition-all ${profile.isSubscribed
                ? "bg-slate-800 text-white hover:bg-slate-700 border border-white/10"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
                }`}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={profile.isSubscribed ? 'subbed' : 'unsubbed'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center"
                >
                  {profile.isSubscribed ? (
                    <><UserCheck className="mr-2 h-4 w-4" /> Subscribed</>
                  ) : (
                    <><UserPlus className="mr-2 h-4 w-4" /> Subscribe</>
                  )}
                </motion.div>
              </AnimatePresence>
            </Button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs defaultValue="videos" className="mt-8" onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start border-b border-white/10 bg-transparent p-0 h-14 overflow-x-auto scrollbar-hide">
          <TabsTrigger value="videos" className="tab-trigger flex items-center">
            <Play className="mr-2 h-4 w-4" /> Videos
          </TabsTrigger>
          <TabsTrigger value="playlists" className="tab-trigger flex items-center">
            <ListVideo className="mr-2 h-4 w-4" /> Playlists
          </TabsTrigger>
          <TabsTrigger value="tweets" className="tab-trigger flex items-center">
            <MessageSquare className="mr-2 h-4 w-4" /> Community
          </TabsTrigger>
          <TabsTrigger value="about" className="tab-trigger flex items-center">
            <Info className="mr-2 h-4 w-4" /> About
          </TabsTrigger>
        </TabsList>

        <div className="pt-8">
          <AnimatePresence mode="wait">
            <TabsContent key="videos" value="videos">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                {videos.map((video) => (
                  <Link key={video._id} href={`/watch/${video._id}`} className="group space-y-3">
                    <div className="aspect-video relative overflow-hidden rounded-xl border border-white/10 group-hover:ring-2 ring-blue-500/50 transition-all">
                      <Image src={video.thumbnail} alt={video.title} fill className="object-cover transition-transform group-hover:scale-105" unoptimized />
                      <div className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs text-white">
                        {Math.floor(video.duration / 60)}:{Math.floor(video.duration % 60).toString().padStart(2, '0')}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2">{video.title}</h3>
                      <p className="text-xs text-slate-400">{video.views.toLocaleString()} views • {formatDistanceToNow(new Date(video.createdAt))} ago</p>
                    </div>
                  </Link>
                ))}
                {videos.length === 0 && (
                  <p className="text-center text-slate-500 col-span-full py-20 italic">This creator hasn't uploaded any videos yet.</p>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent key="playlists" value="playlists">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                {playlists.map((playlist) => (
                  <Link key={playlist._id} href={`/playlist/${playlist._id}`} className="group relative">
                    <div className="aspect-video relative overflow-hidden rounded-xl border border-white/10">
                      <div className="absolute inset-0 bg-slate-800" />
                      {playlist.videos?.[0]?.thumbnail && (
                        <Image src={playlist.videos[0].thumbnail} alt={playlist.name} fill className="object-cover opacity-60" unoptimized />
                      )}
                      <div className="absolute inset-y-0 right-0 w-2/5 bg-black/40 backdrop-blur-md flex flex-col items-center justify-center border-l border-white/10">
                        <span className="text-xl font-bold text-white">{playlist.videos?.length || 0}</span>
                        <ListVideo className="h-5 w-5 text-white mt-1" />
                      </div>
                    </div>
                    <div className="mt-3 space-y-1">
                      <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors">{playlist.name}</h3>
                      <p className="text-xs text-slate-400 italic">View full playlist</p>
                    </div>
                  </Link>
                ))}
                {playlists.length === 0 && (
                  <p className="text-center text-slate-500 col-span-full py-20 italic">No playlists available.</p>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent key="tweets" value="tweets">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto space-y-6"
              >
                {tweets.map((tweet) => (
                  <Card key={tweet._id} className="border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-10 w-10 border border-white/10">
                          <AvatarImage src={profile.avatar} />
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-white">{profile.fullName}</span>
                            <span className="text-xs text-slate-500">{formatDistanceToNow(new Date(tweet.createdAt))} ago</span>
                          </div>
                          <p className="text-slate-200 leading-relaxed font-premium">{tweet.content}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {tweets.length === 0 && (
                  <p className="text-center text-slate-500 py-20 italic">No community posts yet.</p>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent key="about" value="about">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <Card className="border-white/10 bg-white/5 backdrop-blur-md max-w-2xl mx-auto">
                  <CardContent className="p-8 space-y-6 text-white">
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold border-b border-white/10 pb-2">Description</h3>
                      <p className="text-slate-300 leading-relaxed">
                        Welcome to {profile.fullName}'s official channel. This is where you'll find high-quality content
                        ranging from tech tutorials to lifestyle vlogs.
                      </p>
                    </div>

                    <div className="space-y-4 pt-4">
                      <h3 className="text-xl font-bold border-b border-white/10 pb-2">Stats</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                          <p className="text-slate-400">Joined</p>
                          <p className="font-bold">{new Date(profile.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                          <p className="text-slate-400">Total Views</p>
                          <p className="font-bold">{videos.reduce((acc, v) => acc + v.views, 0).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <p className="text-xs text-slate-500">Channel ID: {profile._id}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </div>
      </Tabs>

      <style jsx global>{`
        .tab-trigger {
          @apply rounded-none border-b-2 border-transparent px-8 transition-all duration-300;
          @apply text-slate-400 hover:text-white h-full font-bold;
        }
        .tab-trigger[data-state="active"] {
          @apply border-blue-500 bg-transparent text-white;
        }
      `}</style>
    </div>
  );
}
