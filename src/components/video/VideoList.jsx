import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { videoAPI } from '../../services/api';
import { Loader2, Trash2, Play, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VideoList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: videos, isLoading, error } = useQuery({
    queryKey: ['userVideos'],
    queryFn: () => videoAPI.getUserVideos(),
  });

  const deleteMutation = useMutation({
    mutationFn: (videoId) => videoAPI.deleteVideo(videoId),
    onSuccess: () => {
      queryClient.invalidateQueries(['userVideos']);
    },
    onError: (error) => {
      console.error('Failed to delete video:', error);
    },
  });

  const handleDelete = (videoId) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      deleteMutation.mutate(videoId);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading videos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load videos. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  const userVideos = videos?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Videos</h1>
          <p className="text-gray-600">Manage your uploaded videos</p>
        </div>
        <Button onClick={() => navigate('/upload-video')}>
          Upload New Video
        </Button>
      </div>

      {userVideos.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No videos uploaded yet</h3>
            <p className="text-gray-600 mb-4">Start by uploading your first video!</p>
            <Button onClick={() => navigate('/upload-video')}>
              Upload Video
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userVideos.map((video) => (
            <Card key={video.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-2">{video.title}</CardTitle>
                  <Badge variant="secondary">Video</Badge>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(video.uploadedAt)}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Video Player */}
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <video
                    controls
                    className="w-full h-full rounded-lg"
                    preload="metadata"
                  >
                    <source src={videoAPI.getVideoStream(video.id)} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                
                {video.description && (
                  <CardDescription className="line-clamp-3">
                    {video.description}
                  </CardDescription>
                )}
                
                <div className="flex items-center justify-between pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(videoAPI.getVideoStream(video.id), '_blank')}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    View Full
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(video.id)}
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoList;

