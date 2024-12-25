'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ModeToggle } from '@/components/mode-toggle';
import { Upload, Search, Menu, Youtube } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <Link href="/" className="flex items-center space-x-2">
              <Youtube className="h-6 w-6 text-red-600" />
              <span className="text-xl font-bold">ViewTube</span>
            </Link>
          </div>

          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="flex w-full">
              <Input
                type="search"
                placeholder="Search videos..."
                className="rounded-r-none"
              />
              <Button className="rounded-l-none">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/upload">
                <Upload className="h-5 w-5" />
              </Link>
            </Button>
            <ModeToggle />
            <Button variant="default" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}