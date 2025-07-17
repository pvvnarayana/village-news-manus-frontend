import React, { useRef, useEffect, useState } from 'react';
import NewsList from '../components/news/NewsList';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, Video } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loginWithGoogle } = useAuth();
  const googleButtonRef = useRef(null);
  const [error, setError] = useState('');
  const [, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated() && window.google && googleButtonRef.current) {
      window.google.accounts.id.initialize({
        client_id: "462417954626-mtncb1anftveocc21lkoii0s25rt21vd.apps.googleusercontent.com",
        callback: async (response) => {
          setLoading(true);
          setError('');
          const result = await loginWithGoogle(response);
          if (result.success) {
            navigate('/');
          } else {
            setError(result.error);
          }
          setLoading(false);
        },
      });
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        width: "100%",
      });
    }
  }, [isAuthenticated, loginWithGoogle, navigate]);

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
                className="border-white text-black bg-white hover:bg-blue-100 hover:text-blue-600"
                onClick={() => navigate('/upload-video')}
              >
                <Video className="h-5 w-5 mr-2" />
                Upload Video
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4 w-full max-w-xs">
              {error && (
                <div className="mb-2 text-red-600 text-center">{error}</div>
              )}
              <div ref={googleButtonRef} className="w-full flex justify-center mb-2"></div>
              <Button 
                size="lg" 
                onClick={() => navigate('/register')} 
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Join Community
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="bg-transparent text-white border-white hover:bg-white hover:text-blue-600"
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
