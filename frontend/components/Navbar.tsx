'use client';

import Link from 'next/link';
import { useAuthStore } from '../store/auth';
import { Button } from './ui/Button';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/signin');
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-white border-b border-gray-100 shadow-sm">
      <Link href="/" className="text-2xl font-bold tracking-tight text-brand-primary">
        TaskForge
      </Link>
      <div>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="font-medium text-gray-700 px-3 py-1 bg-brand-light rounded-full text-sm">
              {user.username}
            </span>
            <Button onClick={handleLogout} className="flex items-center gap-2 !bg-gray-100 !text-gray-700 hover:!bg-gray-200 shadow-none border-0">
              <LogOut size={18} />
              Logout
            </Button>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link href="/signin">
              <Button className="!bg-white !text-gray-700 border border-gray-300 hover:!bg-gray-50 shadow-none">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
