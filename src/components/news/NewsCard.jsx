import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, User, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NewsCard = ({ news }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2">{news.title}</CardTitle>
          <Badge variant="secondary" className="ml-2">
            {news.status}
          </Badge>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            {news.author}
          </div>
          
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(news.publishedAt || news.createdAt)}
          </div>
          
          {news.location && (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {news.location}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {news.imageUrl && (
          <img
            src={news.imageUrl}
            alt={news.title}
            className="w-full h-48 object-cover rounded-md mb-4"
          />
        )}
        
        <p className="text-gray-700 mb-4">
          {truncateContent(news.content)}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {news.videoId && (
              <Badge variant="outline" className="flex items-center">
                <Video className="h-3 w-3 mr-1" />
                Video
              </Badge>
            )}
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/news/${news.id}`)}
          >
            Read More
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsCard;

