import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Auth callback error:', error);
          navigate('/login', {
            state: {
              error: 'Authentication failed. Please try again.'
            }
          });
          return;
        }

        if (data.session) {
          // Successfully authenticated
          navigate('/', { replace: true });
        } else {
          // No session, redirect to login
          navigate('/login', {
            state: {
              error: 'Authentication failed. Please try again.'
            }
          });
        }
      } catch (error) {
        console.error('Unexpected error during auth callback:', error);
        navigate('/login', {
          state: {
            error: 'An unexpected error occurred. Please try again.'
          }
        });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-lg rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-blue-600 mx-auto"></div>
          <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
            Completing sign in...
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please wait while we finish setting up your account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;