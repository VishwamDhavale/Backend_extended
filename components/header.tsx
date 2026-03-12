'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ModeToggle } from '@/components/mode-toggle';
import { Upload, Search, Menu, Youtube, User, LogOut, Settings, Bell, ListVideo } from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/videos?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/videos');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/60 backdrop-blur-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <Link href="/" className="flex items-center space-x-2 transition-transform hover:scale-105">
              {/* <Youtube className="h-6 w-6 text-red-600" /> */}
              <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                ViewTube
              </span>
            </Link>
          </div>

          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearch} className="flex w-full group">
              <Input
                type="search"
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-r-none border-white/10 bg-white/5 focus-visible:ring-1 focus-visible:ring-blue-500 transition-all font-medium"
              />
              <Button type="submit" className="rounded-l-none bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>

          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <Button variant="ghost" size="icon" asChild className="hover:bg-white/5 transition-colors">
                  <Link href="/upload">
                    <Upload className="h-5 w-5" />
                  </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-white/10 p-0 hover:bg-white/5 overflow-hidden">
                      <Avatar className="h-10 w-10 translate-y-[-1px]">
                        <AvatarImage src={user.avatar} alt={user.username} />
                        <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 border-white/10 bg-slate-900/95 backdrop-blur-lg" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-white">{user.fullName}</p>
                        <p className="text-xs leading-none text-slate-400">@{user.username}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem asChild className="hover:bg-white/5 focus:bg-white/10 cursor-pointer">
                      <Link href={`/c/${user.username}`}>
                        <User className="mr-2 h-4 w-4 text-blue-400" />
                        <span>Channel Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="hover:bg-white/5 focus:bg-white/10 cursor-pointer">
                      <Link href="/my-videos">
                        <Youtube className="mr-2 h-4 w-4 text-red-400" />
                        <span>My Videos</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="hover:bg-white/5 focus:bg-white/10 cursor-pointer">
                      <Link href="/subscriptions">
                        <Bell className="mr-2 h-4 w-4 text-yellow-400" />
                        <span>Subscriptions</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="hover:bg-white/5 focus:bg-white/10 cursor-pointer">
                      <Link href="/playlists">
                        <ListVideo className="mr-2 h-4 w-4 text-green-400" />
                        <span>Playlists</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="hover:bg-white/5 focus:bg-white/10 cursor-pointer">
                      <Link href="/settings">
                        <Settings className="mr-2 h-4 w-4 text-slate-400" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem
                      onClick={() => logout()}
                      className="text-red-400 hover:bg-red-400/10 focus:bg-red-400/10 cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild className="hover:bg-white/5 transition-colors">
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 transition-colors" asChild>
                  <Link href="/register">Sign up</Link>
                </Button>
              </div>
            )}
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}