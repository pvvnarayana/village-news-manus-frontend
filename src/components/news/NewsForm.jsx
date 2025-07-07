import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { newsAPI, videoAPI } from '../../services/api';
import { Loader2 } from 'lucide-react';

const NewsForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    location: '',
    imageUrl: '',
    videoId: '',
  });
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Get user's videos for selection
  const { data: videos } = useQuery({
    queryKey: ['userVideos'],
    queryFn: () => videoAPI.getUserVideos(),
  });

  const createNewsMutation = useMutation({
    mutationFn: (newsData) => newsAPI.createNews(newsData),
    onSuccess: () => {
      queryClient.invalidateQueries(['news']);
      navigate('/');
    },
    onError: (error) => {
      setError(error.response?.data?.error || 'Failed to submit news article');
    },
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleVideoSelect = (value) => {
    setFormData({
      ...formData,
      videoId: value === 'none' ? '' : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const submitData = {
      ...formData,
      videoId: formData.videoId ? parseInt(formData.videoId) : null,
    };

    createNewsMutation.mutate(submitData);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Submit News Article</CardTitle>
          <CardDescription>
            Share important news and updates from your village community.
            Your submission will be reviewed by administrators before publication.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter a compelling title for your news"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={8}
                placeholder="Write the full content of your news article..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Village name or specific location"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                type="url"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="video">Attach Video (Optional)</Label>
              <Select onValueChange={handleVideoSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a video from your uploads" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No video</SelectItem>
                  {videos?.data?.map((video) => (
                    <SelectItem key={video.id} value={video.id.toString()}>
                      {video.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                type="submit" 
                disabled={createNewsMutation.isPending}
                className="flex-1"
              >
                {createNewsMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Submit for Review
              </Button>
              
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate('/')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsForm;

