import Head from 'next/head';
import Link from 'next/link';
import { Mail, Lock, User, UserPlus } from 'lucide-react';
import React, { useState } from 'react';
import { useRouter } from 'next/router'; // ADDED

const SignUpPage: React.FC = () => {
  // UI-ONLY: State to track form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // ADDED: State for network feedback
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter(); // ADDED: Initialize router

  // REPLACED: Placeholder function with network logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Note: The backend register endpoint may only require email and password
      const response = await fetch('https://web-production-d88ec.up.railway.app/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // We include name if the backend expects it, otherwise focus on email/password
        body: JSON.stringify({ email, password, name }), 
      });

      const data = await response.json();

      if (response.ok) {
        // Success: Store the JWT and user info, then redirect
        const token = data.access_token;
        localStorage.setItem('jwt_token', token);
        localStorage.setItem('user_email', email); 
        localStorage.setItem('user_name', name); 
        
        // Redirect to the dashboard after successful registration
        router.push('/dashboard');
      } else {
        // Failure: Set the error message
        const errorMessage = data.detail || 'Registration failed. That email may already be in use.';
        setError(errorMessage);
      }
    } catch (err) {
      // Network or unexpected error
      setError('An unexpected error occurred. Please try again.');
      console.error('Sign Up Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sign Up | BargainBaaS Dashboard</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-2xl border border-gray-100">
          
          {/* Header */}
          <div>
            <Link href="/" className="text-3xl font-bold text-primary-800 tracking-wider flex justify-center">
              Bargain<span className="text-gray-600">BaaS</span>
            </Link>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Create a new account
            </h2>
          </div>

          {/* ADDED: Error Alert */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {/* End Error Alert */}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              
              {/* Name Input */}
              <div className="mb-4">
                <label htmlFor="full-name" className="sr-only">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="full-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    className="appearance-none rounded-t-lg relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

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
                    className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    autoComplete="new-password"
                    required
                    className="appearance-none rounded-b-lg relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                    placeholder="Password (min 8 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Sign Up Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading} // ADDED
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-800 hover:bg-primary-900 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-md"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <UserPlus className="h-5 w-5 text-primary-300 group-hover:text-white" aria-hidden="true" />
                </span>
                {isLoading ? 'Registering...' : 'Sign Up'} {/* CHANGED */}
              </button>
            </div>
            
            {/* Link to Login */}
            <div className="text-center text-sm text-gray-600">
                Already have an account? 
                <Link href="/auth/login" className="font-medium text-primary-600 hover:text-primary-500 ml-1 transition duration-150">
                    Sign in here
                </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUpPage;