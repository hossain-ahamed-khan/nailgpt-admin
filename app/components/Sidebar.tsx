'use client';

import { Grid2X2, BookOpen, Users, Key, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import mainLogo from '@/public/main-logo-nailgpt.png';
import Image from 'next/image';
import { selectUser } from '@/redux/features/auth/authSlice';
import { useAppSelector } from '@/redux/hooks';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const user = useAppSelector(selectUser);
  const pathname = usePathname();

  const navItems = [
    { label: 'Overview', href: '/admin', icon: Grid2X2 },
    { label: 'Knowledge Base', href: '/admin/Knowledge-Base', icon: BookOpen },
    { label: 'Users', href: '/admin/Users', icon: Users },
    { label: 'Api Key', href: '/admin/ApI-Key', icon: Key },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden bg-amber-400 p-2 rounded-lg text-gray-900"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden bg-black bg-opacity-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:relative w-64 h-screen lg:h-auto bg-gray-50 border-r border-gray-200 p-4 sm:p-6 flex flex-col z-40 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
        {/* Header with Logo and Admin Badge */}
        <div className="flex items-center justify-between mb-8 mt-12 lg:mt-0">
          <div className="flex items-center gap-2">
            <Image
              src={mainLogo}
              alt="NailGPT Logo"
              width={100}
              height={24}
              className="object-contain"
            />
          </div>
          <div className="px-2 sm:px-3 py-1 border border-yellow-400 rounded-full text-xs font-medium text-yellow-600">
            Admin
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-3 flex-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`rounded-lg p-3 sm:p-4 flex items-center gap-3 cursor-pointer transition ${active ? 'bg-yellow-400 hover:bg-yellow-500' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-gray-900' : ''}`} />
                  <span
                    className={`text-xs sm:text-sm ${active ? 'font-semibold text-gray-900' : 'font-medium text-gray-600'
                      }`}
                  >
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 border border-yellow-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-pink-400 to-orange-400 flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0">
              J
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-yellow-700">{user?.full_name}</p>
              <p className="text-xs text-yellow-600">Admin</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
