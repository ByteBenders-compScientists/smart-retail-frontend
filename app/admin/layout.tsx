'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  LayoutDashboard, 
  Package, 
  BarChart3, 
  LogOut,
  Menu,
  X,
  Bell,
  User,
  Settings
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Restock',
      href: '/admin/restock',
      icon: Package,
    },
    {
      name: 'Reports',
      href: '/admin/reports',
      icon: BarChart3,
    },
  ];

  const handleLogout = () => {
    router.push('/admin/admin-login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header Bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 lg:pl-72">
        <div className="h-full px-4 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>

          {/* Logo for Mobile */}
          <div className="lg:hidden">
            <Image
              src="/images/dark.png"
              alt="Drinx Logo"
              width={120}
              height={24}
            />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 rounded-md hover:bg-gray-100 transition-colors">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Settings */}
            <button className="p-2 rounded-md hover:bg-gray-100 transition-colors hidden sm:block">
              <Settings className="h-5 w-5 text-gray-600" />
            </button>

            {/* Admin Profile */}
            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-gray-900">Admin</p>
                <p className="text-xs text-gray-500">Nairobi HQ</p>
              </div>
              <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Container with Padding (Desktop Only) */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 lg:px-4 lg:py-4 lg:pt-20 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar with Background Image */}
        <div className="relative h-full lg:rounded-2xl overflow-hidden shadow-xl">
          {/* Background Image */}
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: 'url(/images/drinks.jpg)' }}
            />
            {/* Slate Overlay */}
            <div className="absolute inset-0 bg-slate-900/85" />
          </div>

          {/* Sidebar Content */}
          <div className="relative flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center px-6 py-6 border-b border-white/10">
              <Image
                src="/images/logodark.png"
                alt="Drinx Logo"
                width={180}
                height={36}
                
              />
            </div>

            {/* Admin Badge */}
            <div className="px-6 py-4 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Administrator</p>
                  <p className="text-xs text-gray-300">Nairobi HQ</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-white text-slate-900'
                        : 'text-gray-200 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Quick Stats */}
            <div className="px-6 py-4 border-t border-white/10">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <p className="text-xs text-gray-300 mb-2">Total Revenue Today</p>
                <p className="text-2xl font-bold text-white">KSh 45,000</p>
                <p className="text-xs text-green-400 mt-1">↑ 12.5% from yesterday</p>
              </div>
            </div>

            {/* Logout */}
            <div className="p-4 border-t border-white/10">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg text-gray-200 hover:bg-red-500/20 hover:text-red-400 transition-all"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-72 pt-16">
        {children}
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}