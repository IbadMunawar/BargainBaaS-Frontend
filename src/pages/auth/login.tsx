import Head from 'next/head';
import Link from 'next/link';
import { Mail, Lock, LogIn } from 'lucide-react';
import React, { useState } from 'react';

const LoginPage: React.FC = () => {
  // UI-ONLY: State to track form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // UI-ONLY: Placeholder function
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt (UI ONLY):', { email, password });
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
                    autoComplete="current-password"
                    required
                    className="appearance-none rounded-b-lg relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-800 hover:bg-primary-900 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-md"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LogIn className="h-5 w-5 text-primary-300 group-hover:text-white" aria-hidden="true" />
                </span>
                Sign in
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
