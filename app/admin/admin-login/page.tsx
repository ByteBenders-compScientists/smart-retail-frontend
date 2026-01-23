'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, Check, Shield, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { useAuthContext } from '@/contexts/AuthContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, isAuthenticated, isHydrated, login, getDashboardPath } = useAuthContext();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Rotating images and messages
  const slides = [
    {
      image: '/images/drinks.jpg',
      gradient: 'from-slate-800/60 via-slate-900/70 to-slate-950/90',
      title: 'Admin Control Center',
      subtitle: 'Manage all branches from one place',
    },
    {
      image: '/images/drinks2.jpg',
      gradient: 'from-slate-800/60 via-slate-900/70 to-slate-950/90',
      title: 'Real-Time Analytics',
      subtitle: 'Monitor sales across Kenya',
    },
    {
      image: '/images/drinks3.jpg',
      gradient: 'from-slate-800/60 via-slate-900/70 to-slate-950/90',
      title: 'Inventory Management',
      subtitle: 'Restock from headquarters',
    },
  ];

  // Auto-rotate images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { user } = await login(formData);
      setShowSuccess(true);

      const dashboard = getDashboardPath(user.role);
      setTimeout(() => {
        router.push(dashboard);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  if (isHydrated && isAuthenticated && user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE - FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {!showSuccess ? (
            <>
              {/* Logo */}
              <div className="mb-8">
                <Link href="/" className="inline-block">
                  <Image
                    src="/images/dark.png"
                    alt="Drinx Logo"
                    width={250}
                    height={50}
                  />
                </Link>
              </div>

              {/* Admin Badge */}
              <div className="mb-8 inline-flex items-center space-x-2 px-4 py-2 bg-slate-900 rounded-lg">
                <Shield className="h-5 w-5 text-white" />
                <span className="text-white font-semibold">Admin Access</span>
              </div>

              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Administrator Login
                </h1>
                <p className="text-gray-600">
                  Sign in to access the admin control panel
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full placeholder:text-gray-400 outline-0 text-gray-900 pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                      placeholder="admin@example.com"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full placeholder:text-gray-400 outline-0 text-gray-900 pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center py-3 px-4 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Authenticating...</span>
                    </div>
                  ) : (
                    <>
                      <span>Sign In as Admin</span>
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-6 space-y-3 text-center">
                <p className="text-sm text-gray-600">
                  Customer?{' '}
                  <Link href="/auth/login" className="text-sky-600 font-medium hover:text-sky-700">
                    Sign in here
                  </Link>
                </p>
                <Link href="/" className="block text-sm text-gray-600 hover:text-gray-900">
                  ← Back to homepage
                </Link>
              </div>
            </>
          ) : (
            /* SUCCESS STATE */
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <Check className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Access Granted!
              </h2>
              <p className="text-gray-600 mb-4">
                Redirecting to admin dashboard...
              </p>
              <div className="flex justify-center">
                <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDE - ROTATING IMAGES */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-white p-6">
        <div className="relative w-full h-full">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 rounded-2xl overflow-hidden shadow-xl ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              />

              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`} />

              {/* Content */}
              <div className="relative h-full flex flex-col items-center justify-center text-white p-12">
                <div className="mb-6">
                  <Shield className="h-16 w-16 text-white opacity-90" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center drop-shadow-lg">
                  {slide.title}
                </h2>
                <p className="text-xl md:text-2xl text-center opacity-90 drop-shadow-md">
                  {slide.subtitle}
                </p>

                {/* Dots Indicator */}
                <div className="absolute bottom-12 flex space-x-2">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === currentImageIndex
                          ? 'bg-white w-8'
                          : 'bg-white/50 hover:bg-white/75'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
