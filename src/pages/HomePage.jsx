import React from 'react';
import NewsList from '../components/news/NewsList';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, Video } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">Welcome to Village News</h1>
          <p className="text-xl mb-6">
            Stay connected with your community. Share important news, events, and updates 
            that matter to your village.
          </p>
          
          {isAuthenticated() ? (
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate('/submit-news')}
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Submit News
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-blue-600"
                onClick={() => navigate('/upload-video')}
              >
                <Video className="h-5 w-5 mr-2" />
                Upload Video
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate('/register')}
              >
                Join Community
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-blue-600"
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* News Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Latest News</h2>
            <p className="text-gray-600">Stay updated with the latest happenings in your community</p>
          </div>
          
          {isAuthenticated() && (
            <Button onClick={() => navigate('/submit-news')}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Submit News
            </Button>
          )}
        </div>
        
        <NewsList />
      </div>
    </div>
  );
};

export default HomePage;

