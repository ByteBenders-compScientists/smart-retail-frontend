'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  ShoppingBag,
  ShoppingCart,
  History,
  User,
  LogOut,
  MapPin,
  Menu,
  X,
  Bell,
  ChevronDown,
} from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { ROUTES } from '@/lib/constants';

export default function Navigation() {
  const { user, logout } = useAuthContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('Nairobi HQ');
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const branches = [
    'Nairobi HQ',
    'Kisumu Branch',
    'Mombasa Branch',
    'Nakuru Branch',
    'Eldoret Branch'
  ];

  const navItems = [
    { name: 'Dashboard', href: '/customer/dashboard', icon: Home },
    { name: 'Shop', href: '/customer/shop', icon: ShoppingBag },
    { name: 'Cart', href: '/customer/cart', icon: ShoppingCart },
    { name: 'Orders', href: '/customer/orders', icon: History }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push(ROUTES.LOGIN);
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 border-b ${
      isScrolled 
        ? 'bg-slate-800/95 backdrop-blur-md shadow-lg border-slate-700' 
        : 'bg-slate-800 border-slate-700'
    }`}>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            <Link href="/customer/dashboard" className="flex items-center">
              <div className="relative w-32 h-10 sm:w-40 sm:h-12">
                <Image
                  src="/images/logo.png"
                  alt="Drinx Retailers"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Center: Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-slate-300 hover:text-white transition-all group"
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{item.name}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></span>
                  )}
                  {!isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {/* Branch Selector - Desktop */}
            <div className="hidden md:block">
              <div className="relative group">
                <button className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-colors">
                  <MapPin className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-medium text-white">{selectedBranch}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>
                
                <div className="absolute top-full mt-2 right-0 w-56 bg-slate-700 rounded-lg shadow-2xl border border-slate-600 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  {branches.map((branch) => (
                    <button
                      key={branch}
                      onClick={() => setSelectedBranch(branch)}
                      className={`w-full text-left px-4 py-2.5 hover:bg-slate-600 transition-colors flex items-center gap-3 ${
                        selectedBranch === branch ? 'bg-slate-600 text-blue-400 font-medium' : 'text-slate-300'
                      }`}
                    >
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{branch}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-blue-500 rounded-full ring-2 ring-slate-800"></span>
            </button>

            {/* Cart */}
            <Link
              href="/customer/cart"
              className="relative p-2 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                3
              </span>
            </Link>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:block" />
              </button>

              {isProfileOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsProfileOpen(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-56 bg-slate-700 rounded-lg shadow-2xl border border-slate-600 py-2 z-50">
                    <div className="px-4 py-3 border-b border-slate-600">
                      <p className="font-semibold text-white">John Doe</p>
                      <p className="text-xs text-slate-400">john@example.com</p>
                    </div>
                    <Link
                      href="/customer/profile"
                      className="flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:bg-slate-600 hover:text-white transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      <span className="text-sm">Profile Settings</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-red-400 hover:bg-slate-600 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="text-sm">Logout</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Branch Selector - Mobile */}
        <div className="md:hidden pb-3">
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full bg-slate-700 border-0 rounded-lg px-4 py-2.5 text-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none cursor-pointer"
          >
            {branches.map((branch) => (
              <option key={branch} value={branch} className="bg-slate-700">
                {branch}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-slate-700 bg-slate-800">
          <div className="px-4 py-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                  {isActive && (
                    <span className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r"></span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}