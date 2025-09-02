import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, UserPlus, LogIn, Apple } from 'lucide-react';

const RegisterPage: React.FC = () => {
  useEffect(() => {
    document.title = 'AI Twin Tech - Register';
  }, []);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, loginWithGoogle, loginWithApple } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!email || !password) {
        setError('Please fill out all fields.');
        return;
    }

    setLoading(true);
    const { error: authError } = await register(email, password);
    setLoading(false);

    if (authError) {
      setError(authError.message);
      setSuccess('');
    } else {
      // Show success message for email verification
      setError(''); // Clear any previous errors
      setSuccess('Registration successful! Please check your email and click the verification link to activate your account.');
      // Don't navigate immediately - user needs to verify email first
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
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Create a new account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-center text-sm">{error}</p>}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <p className="text-green-800 text-center text-sm">{success}</p>
            </div>
          )}
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
                className="appearance-none rounded relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-electric-blue-500 focus:border-electric-blue-500 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || !!success}
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
                autoComplete="new-password"
                required
                className="appearance-none rounded relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-electric-blue-500 focus:border-electric-blue-500 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || !!success}
              />
            </div>
            <div className="relative">
              <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-electric-blue-500 focus:border-electric-blue-500 sm:text-sm"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading || !!success}
              />
            </div>
          </div>

          {/* Consent Checkbox */}
          <div className="flex items-center">
            <input
              id="consent"
              name="consent"
              type="checkbox"
              required
              className="h-4 w-4 text-electric-blue-600 focus:ring-electric-blue-500 border-gray-300 rounded"
              disabled={loading || !!success}
            />
            <label htmlFor="consent" className="ml-2 block text-sm text-gray-900">
              I agree to receive updates and communications about new features and content
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || !!success}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {loading ? 'Registering...' : 'Register'}
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
            disabled={loading || !!success}
            className="w-full inline-flex justify-center items-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-electric-blue-500 disabled:opacity-50"
          >
            <span className="w-5 h-5 flex items-center justify-center text-sm font-bold">G</span>
            Google
          </button>

          <button
            onClick={handleAppleLogin}
            disabled={loading || !!success}
            className="w-full inline-flex justify-center items-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-electric-blue-500 disabled:opacity-50"
          >
            <Apple className="w-5 h-5" />
            Apple
          </button>
        </div>

        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" state={{ from: location.state?.from }} className="font-medium text-electric-blue-600 hover:text-electric-blue-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;