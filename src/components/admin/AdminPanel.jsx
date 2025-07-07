import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { adminAPI } from '../../services/api';
import { Loader2, Check, X, Calendar, MapPin, User } from 'lucide-react';

const AdminPanel = () => {
  const queryClient = useQueryClient();

  const { data: pendingNews, isLoading, error } = useQuery({
    queryKey: ['pendingNews'],
    queryFn: () => adminAPI.getPendingNews(),
  });

  const approveMutation = useMutation({
    mutationFn: (newsId) => adminAPI.approveNews(newsId),
    onSuccess: () => {
      queryClient.invalidateQueries(['pendingNews']);
      queryClient.invalidateQueries(['news']);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (newsId) => adminAPI.rejectNews(newsId),
    onSuccess: () => {
      queryClient.invalidateQueries(['pendingNews']);
    },
  });

  const handleApprove = (newsId) => {
    if (window.confirm('Are you sure you want to approve this news article?')) {
      approveMutation.mutate(newsId);
    }
  };

  const handleReject = (newsId) => {
    if (window.confirm('Are you sure you want to reject this news article?')) {
      rejectMutation.mutate(newsId);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateContent = (content, maxLength = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading pending news...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load pending news articles. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  const pendingArticles = pendingNews?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-600">Review and manage pending news articles</p>
      </div>

      {pendingArticles.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pending articles</h3>
            <p className="text-gray-600">All news articles have been reviewed!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900">
              {pendingArticles.length} article{pendingArticles.length !== 1 ? 's' : ''} pending review
            </h3>
          </div>

          {pendingArticles.map((article) => (
            <Card key={article.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{article.title}</CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {article.author?.username || 'Unknown Author'}
                      </div>
                      
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(article.createdAt)}
                      </div>
                      
                      {article.location && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {article.location}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Badge variant="secondary">
                    {article.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {article.imageUrl && (
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                )}
                
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {truncateContent(article.content)}
                  </p>
                </div>
                
                {article.video && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">
                      Attached Video: {article.video.title}
                    </p>
                    {article.video.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {article.video.description}
                      </p>
                    )}
                  </div>
                )}
                
                <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                  <Button
                    variant="destructive"
                    onClick={() => handleReject(article.id)}
                    disabled={rejectMutation.isPending}
                  >
                    {rejectMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <X className="h-4 w-4 mr-2" />
                    )}
                    Reject
                  </Button>
                  
                  <Button
                    onClick={() => handleApprove(article.id)}
                    disabled={approveMutation.isPending}
                  >
                    {approveMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Check className="h-4 w-4 mr-2" />
                    )}
                    Approve
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

export default AdminPanel;

