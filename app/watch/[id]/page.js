import VideoPlayer from '@/components/video/video-player'
import VideoInfo from '@/components/video/video-info'
import CommentSection from '@/components/video/comment-section'
import RelatedVideos from '@/components/video/related-videos'

export const metadata = {
  title: 'Video Title - ViewTube',
  description: 'Watch videos on ViewTube',
}

export default function WatchPage({ params }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <VideoPlayer videoId={params.id} />
        <VideoInfo videoId={params.id} />
        <CommentSection videoId={params.id} />
      </div>
      <div className="lg:col-span-1">
        <RelatedVideos currentVideoId={params.id} />
      </div>
    </div>
  )
}