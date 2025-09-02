import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, UserPlus, Eye, EyeOff, Apple } from 'lucide-react';

const LoginPage: React.FC = () => {
  useEffect(() => {
    document.title = 'AI Twin Tech - Login';
  }, []);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle, loginWithApple } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    
    setLoading(true);
    const { error: authError } = await login(email, password);
    setLoading(false);
    
    if (authError) {
      setError(authError.message);
    } else {
      navigate(from, { replace: true });
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await loginWithGoogle();
    if (error) {
      setError(error.message);
    }
  };

  const handleAppleLogin = async () => {
    const { error } = await loginWithApple();
    if (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-lg rounded-lg">
        <div>
          <p className="text-center text-sm text-gray-500">
            This is all free, we just want to know you and keep you informed when new versions are deployed.
          </p>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-center text-sm">{error}</p>}
          <div className="space-y-4">
            <div className="relative">
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Mail className="w-5 h-5 text-gray-400" />
              </div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-electric-blue-500 focus:border-electric-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-electric-blue-500 focus:border-electric-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent text-sm font-medium rounded text-white bg-electric-blue-600 hover:bg-electric-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-electric-blue-500 disabled:bg-electric-blue-400 disabled:cursor-not-allowed"
            >
              <LogIn className="w-4 h-4" />
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full inline-flex justify-center items-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-electric-blue-500 disabled:opacity-50"
          >
            <span className="w-5 h-5 flex items-center justify-center text-sm font-bold">G</span>
            Google
          </button>

          <button
            onClick={handleAppleLogin}
            disabled={loading}
            className="w-full inline-flex justify-center items-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-electric-blue-500 disabled:opacity-50"
          >
            <Apple className="w-5 h-5" />
            Apple
          </button>
        </div>

        <p className="mt-2 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" state={{ from: location.state?.from }} className="inline-flex items-center gap-1 font-medium text-electric-blue-600 hover:text-electric-blue-500">
            <UserPlus className="w-4 h-4" />
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;