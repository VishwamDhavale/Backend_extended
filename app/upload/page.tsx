'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/auth-provider';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Upload, Film, Image as ImageIcon, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import axios from 'axios';

export default function UploadPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploaded, setIsUploaded] = useState(false);
  const [uploadedVideoId, setUploadedVideoId] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  if (!user) {
    if (typeof window !== 'undefined') router.push('/login');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile || !thumbnail) {
      toast({ title: 'Error', description: 'Please select both video and thumbnail files.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('videoFile', videoFile);
      data.append('thumbnail', thumbnail);

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

      const response = await axios.post(`${API_BASE_URL}/videos`, data, {
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setUploadProgress(progress);
        },
      });
      
      setUploadedVideoId(response.data.data._id);
      setIsUploaded(true);
      toast({ title: 'Success', description: 'Video uploaded successfully! You can now publish it.' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.response?.data?.message || error.message || 'Failed to upload video.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!uploadedVideoId) return;

    setIsPublishing(true);
    try {
      await api.patch(`/videos/toggle/publish/${uploadedVideoId}`);
      toast({ title: 'Success', description: 'Video published successfully!' });
      router.push('/dashboard');
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to publish video.', variant: 'destructive' });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-20 pt-10">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Upload Video</h1>
        <p className="text-slate-400">Share your content with the ViewTube community.</p>
      </div>

      <AnimatePresence mode="wait">
        {!isUploaded ? (
          <motion.div 
            key="upload-form"
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-white/10 bg-white/5 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white">Video Details</CardTitle>
                <CardDescription className="text-slate-400">Fill in the information for your new video.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* ... existing fields ... */}
                  <div className="grid gap-2">
                    <Label htmlFor="title" className="text-slate-300">Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter a catchy title"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="border-white/10 bg-black/20 text-white focus:border-blue-500"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="description" className="text-slate-300">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="What is this video about?"
                      required
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="border-white/10 bg-black/20 text-white focus:border-blue-500"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Video File</Label>
                      <div 
                        className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all ${
                          videoFile ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 hover:border-white/20 bg-black/20'
                        } p-6 text-center cursor-pointer`}
                        onClick={() => document.getElementById('video-input')?.click()}
                      >
                        <Upload className={`h-8 w-8 mb-2 ${videoFile ? 'text-blue-400' : 'text-slate-500'}`} />
                        <p className="text-sm text-slate-300">{videoFile ? videoFile.name : 'Click to select video'}</p>
                        <p className="mt-1 text-xs text-slate-500">MP4, WebM (Max 50MB)</p>
                        <input 
                          id="video-input" 
                          type="file" 
                          accept="video/*" 
                          className="hidden" 
                          onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Thumbnail</Label>
                      <div 
                        className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all ${
                          thumbnail ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 hover:border-white/20 bg-black/20'
                        } p-6 text-center cursor-pointer`}
                        onClick={() => document.getElementById('thumb-input')?.click()}
                      >
                        <ImageIcon className={`h-8 w-8 mb-2 ${thumbnail ? 'text-indigo-400' : 'text-slate-500'}`} />
                        <p className="text-sm text-slate-300">{thumbnail ? thumbnail.name : 'Click to select thumbnail'}</p>
                        <p className="mt-1 text-xs text-slate-500">JPG, PNG (Max 5MB)</p>
                        <input 
                          id="thumb-input" 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>

                  {isLoading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Uploading...</span>
                        <span className="text-blue-400 font-bold">{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2 bg-white/10" />
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg font-bold shadow-lg shadow-blue-500/20"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Uploading {uploadProgress}%
                      </>
                    ) : (
                      <>
                        <Film className="mr-2 h-5 w-5" />
                        Upload Video
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div 
            key="publish-step"
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center space-y-6 py-12"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full" />
              <CheckCircle2 className="h-24 w-24 text-green-500 relative" />
            </div>
            
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-white">Upload Complete!</h2>
              <p className="text-slate-400 max-w-md mx-auto">
                Your video "{formData.title}" has been successfully uploaded to our servers. Now it's time to make it public.
              </p>
            </div>

            <div className="flex flex-col w-full max-w-md space-y-3">
              <Button 
                onClick={handlePublish}
                disabled={isPublishing}
                className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-xl font-black uppercase tracking-tighter"
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  'Publish Now'
                )}
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => router.push('/dashboard')}
                className="text-slate-400 hover:text-white"
                disabled={isPublishing}
              >
                Go to Dashboard (Stay Unpublished)
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
