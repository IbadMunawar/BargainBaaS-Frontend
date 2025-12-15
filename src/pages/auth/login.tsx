import Head from 'next/head';
import Link from 'next/link';
import { Mail, Lock, LogIn } from 'lucide-react';
import React, { useState, useEffect } from 'react'; // ADDED useEffect
import { useRouter } from 'next/router';

const LoginPage: React.FC = () => {
  // UI-ONLY: State to track form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // State for network feedback
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter(); // Initialize router

  // ADDED BLOCK: Guarantee the error state is a string (Crash Prevention)
  useEffect(() => {
    if (error && typeof error !== 'string') {
      console.error("Corrupted error state detected. Auto-correcting.", error);
      setError('A critical error occurred while processing your login.');
    }
  }, [error]); // Run whenever the error state changes

  // REPLACED: Placeholder function with network logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('https://web-production-04173.up.railway.app/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success: Store the JWT and user email, then redirect
        const token = data.access_token;
        localStorage.setItem('jwt_token', token);
        localStorage.setItem('user_email', email); // Save email for dashboard greeting

        // Use the Next.js router to redirect to the dashboard
        router.push('/dashboard');
      } else {
        // Failure: Set the error message (using the backend detail or a generic message)
        const errorMessage = data.detail || 'Login failed. Please check your credentials.';
        setError(errorMessage);
      }
    } catch (err) {
      // Network or unexpected error
      // ⬇️ REPLACED LINE: Safely convert the error object to a string for display
      const errorString = err instanceof Error ? err.message : 'An unexpected network error occurred. Check your connection.';
      setError(errorString);
      console.error('Login Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login | BargainBaaS Dashboard</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-2xl border border-gray-100">

          {/* Header */}
          <div>
            <Link href="/" className="text-3xl font-bold text-primary-800 tracking-wider flex justify-center">
              Bargain<span className="text-gray-600">BaaS</span>
            </Link>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {/* End Error Alert */}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">

              {/* Email Input */}
              <div className="mb-4">
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none rounded-t-lg relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} // FIX: Use the input value
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none rounded-b-lg relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} // This was already correct
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Remember Me Checkbox (Optional) */}
              </div>

              <div className="text-sm">
                <Link href="#" className="font-medium text-primary-600 hover:text-primary-500 transition duration-150">
                  Forgot your password?
                </Link>
              </div>
            </div>

            {/* Login Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-800 hover:bg-primary-900 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-md"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LogIn className="h-5 w-5 text-primary-300 group-hover:text-white" aria-hidden="true" />
                </span>
                {isLoading ? 'Signing In...' : 'Sign in'}
              </button>
            </div>

            {/* Link to Sign Up */}
            <div className="text-center text-sm text-gray-600">
              Don&apos;t have an account?
              <Link href="/auth/signup" className="font-medium text-primary-600 hover:text-primary-500 ml-1 transition duration-150">
                Sign up now
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;