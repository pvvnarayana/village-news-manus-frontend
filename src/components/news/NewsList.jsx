import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { newsAPI } from '../../services/api';
import NewsCard from './NewsCard';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const NewsList = () => {
  const { data: news, isLoading, error } = useQuery({
    queryKey: ['news'],
    queryFn: () => newsAPI.getApprovedNews(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading news...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load news articles. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  const newsArticles = news?.data || [];

  if (newsArticles.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No news articles yet</h3>
        <p className="text-gray-600">Be the first to submit a news article!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {newsArticles.map((article) => (
        <NewsCard key={article.id} news={article} />
      ))}
    </div>
  );
};

export default NewsList;

