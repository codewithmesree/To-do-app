import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center">
      <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-gray-900 px-6 py-4">
        Organize your work.
        <br />
        <span className="text-brand-primary">Find your focus.</span>
      </h1>
      <p className="text-xl text-gray-600 mb-12 max-w-2xl px-4">
        TaskForge provides a calm and productive environment to help you manage your daily tasks without the noise.
      </p>
      <Link href="/signup">
        <Button className="text-lg px-8 py-3">
          Get Started
        </Button>
      </Link>
    </div>
  );
}
