import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { videoAPI } from '../../services/api';
import { Loader2, Upload } from 'lucide-react';

const VideoUpload = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: (formData) => videoAPI.uploadVideo(formData),
    onSuccess: () => {
      queryClient.invalidateQueries(['userVideos']);
      navigate('/my-videos');
    },
    onError: (error) => {
      setError(error.response?.data?.error || 'Failed to upload video');
    },
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check file size (limit to 100MB)
      if (selectedFile.size > 100 * 1024 * 1024) {
        setError('File size must be less than 100MB');
        return;
      }
      
      // Check file type
      if (!selectedFile.type.startsWith('video/')) {
        setError('Please select a valid video file');
        return;
      }
      
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!file) {
      setError('Please select a video file');
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('title', formData.title);
    uploadFormData.append('description', formData.description);

    uploadMutation.mutate(uploadFormData);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Upload Video</CardTitle>
          <CardDescription>
            Upload videos related to village news and events. 
            Maximum file size: 100MB. Supported formats: MP4, AVI, MOV, etc.
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
                placeholder="Enter a title for your video"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe what this video is about..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="video">Video File *</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="video" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        {file ? file.name : 'Choose video file'}
                      </span>
                      <input
                        id="video"
                        name="video"
                        type="file"
                        accept="video/*"
                        onChange={handleFileChange}
                        className="sr-only"
                        required
                      />
                    </label>
                    <p className="mt-1 text-xs text-gray-500">
                      MP4, AVI, MOV up to 100MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {file && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900">Selected File:</h4>
                <p className="text-sm text-gray-600">{file.name}</p>
                <p className="text-sm text-gray-600">
                  Size: {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            )}
            
            <div className="flex items-center space-x-4">
              <Button 
                type="submit" 
                disabled={uploadMutation.isPending}
                className="flex-1"
              >
                {uploadMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Upload Video
              </Button>
              
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate('/my-videos')}
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

export default VideoUpload;

