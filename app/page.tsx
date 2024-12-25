import { Card } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';

const videos = [
  {
    id: '1',
    title: 'Building a Modern Web Application',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    channel: 'Tech Tutorials',
    views: '125K',
    timestamp: '2 days ago',
  },
  {
    id: '2',
    title: 'Advanced TypeScript Patterns',
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
    channel: 'Code Masters',
    views: '89K',
    timestamp: '5 days ago',
  },
  // Add more sample videos here
];

export default function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {videos.map((video) => (
        <Link key={video.id} href={`/watch/${video.id}`}>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video relative">
              <Image
                src={video.thumbnail}
                alt={video.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold line-clamp-2">{video.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{video.channel}</p>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <span>{video.views} views</span>
                <span className="mx-1">•</span>
                <span>{video.timestamp}</span>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}