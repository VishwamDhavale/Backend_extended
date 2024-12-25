'use client'

import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Card } from '@/components/ui/card'

export default function VideoPlayer({ videoId }: { videoId: string }) {
  return (
    <Card className="overflow-hidden">
      <AspectRatio ratio={16 / 9}>
        <div className="bg-muted w-full h-full flex items-center justify-center">
          <span className="text-muted-foreground">Video Player Placeholder</span>
        </div>
      </AspectRatio>
    </Card>
  )
}