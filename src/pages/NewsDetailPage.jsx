import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { newsAPI, videoAPI } from '../services/api';
import { Loader2, ArrowLeft, Calendar, MapPin, User, Video } from 'lucide-react';

const NewsDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: news, isLoading, error } = useQuery({
    queryKey: ['news', id],
    queryFn: () => newsAPI.getNewsById(id),
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading article...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load the news article. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const article = news?.data;

  if (!article) {
    return (
      <div className="space-y-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
        <Alert>
          <AlertDescription>
            Article not found.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <Button 
        variant="outline" 
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Button>

      {/* Article Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">
            {article.title}
          </h1>
          <Badge variant="secondary">
            {article.status}
          </Badge>
        </div>
        
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            <span className="font-medium">{article.author}</span>
          </div>
          
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            {formatDate(article.publishedAt || article.createdAt)}
          </div>
          
          {article.location && (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              {article.location}
            </div>
          )}
        </div>
      </div>

      {/* Article Image */}
      {article.imageUrl && (
        <div className="rounded-lg overflow-hidden">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-96 object-cover"
          />
        </div>
      )}

      {/* Article Content */}
      <div className="prose max-w-none">
        <div className="text-lg leading-relaxed text-gray-800 whitespace-pre-wrap">
          {article.content}
        </div>
      </div>

      {/* Attached Video */}
      {article.videoId && (
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Video className="h-5 w-5 mr-2 text-blue-600" />
            <h3 className="text-lg font-semibold">
              {article.videoTitle || 'Attached Video'}
            </h3>
          </div>
          
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <video
              controls
              className="w-full h-full"
              preload="metadata"
            >
              <source src={videoAPI.getVideoStream(article.videoId)} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}

      {/* Article Footer */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Published on {formatDate(article.publishedAt || article.createdAt)}
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
          >
            Read More Articles
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailPage;

