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
    <nav className="flex justify-between items-center p-4 border-b-4 border-black bg-white">
      <Link href="/" className="text-2xl font-black uppercase tracking-tighter">
        TaskForge
      </Link>
      <div>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="font-bold border-2 border-black px-3 py-1 bg-pastel-blue">
              {user.username}
            </span>
            <Button onClick={handleLogout} className="flex items-center gap-2 bg-red-400 hover:bg-red-500">
              <LogOut size={18} />
              Logout
            </Button>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link href="/signin">
              <Button>Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-yellow-300">Sign Up</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
