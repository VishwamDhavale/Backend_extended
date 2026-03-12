'use client';

import { useAuth } from '@/components/auth/auth-provider';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, History, Users, Heart } from 'lucide-react';
import Image from 'next/image';

import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const stats = [
    { label: 'Total Views', value: '0', icon: Play, color: 'text-blue-400' },
    { label: 'Subscribers', value: '0', icon: Users, color: 'text-indigo-400' },
    { label: 'Total Likes', value: '0', icon: Heart, color: 'text-red-400' },
    { label: 'History Items', value: '0', icon: History, color: 'text-purple-400' },
  ];

  return (
    <div className="space-y-8 pb-10 pt-6">
      <div className="flex flex-col space-y-2 text-white">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">{user.fullName}</span>!
        </h1>
        <p className="text-slate-400">Here's what's happening with your channel today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:bg-white/10">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">{stat.label}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold text-white">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card 
            onClick={() => router.push('/upload')}
            className="group border-white/10 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 backdrop-blur-sm cursor-pointer hover:border-blue-500/50 transition-all"
          >
            <CardContent className="flex items-center space-x-4 p-6">
              <div className="rounded-full bg-blue-600 p-3 transition-transform group-hover:scale-110">
                <Play className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white">Upload Video</p>
                <p className="text-sm text-slate-400">Share a new video with your followers</p>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            onClick={() => router.push('/my-videos')}
            className="group border-white/10 bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm cursor-pointer hover:border-purple-500/50 transition-all font-bold"
          >
            <CardContent className="flex items-center space-x-4 p-6">
              <div className="rounded-full bg-purple-600 p-3 transition-transform group-hover:scale-110">
                <Play className="h-6 w-6 text-white rotate-90" />
              </div>
              <div>
                <p className="font-semibold text-white">My Videos</p>
                <p className="text-sm text-slate-400">Manage your published library</p>
              </div>
            </CardContent>
          </Card>

          <Card 
            onClick={() => router.push(`/c/${user.username}`)}
            className="group border-white/10 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-sm cursor-pointer hover:border-indigo-500/50 transition-all"
          >
            <CardContent className="flex items-center space-x-4 p-6">
              <div className="rounded-full bg-indigo-600 p-3 transition-transform group-hover:scale-110">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white">Channel Profile</p>
                <p className="text-sm text-slate-400">Customize how others see your channel</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}