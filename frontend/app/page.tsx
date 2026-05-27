import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-black uppercase tracking-tighter mb-6 bg-white px-6 py-4 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        Crush your tasks.
        <br />
        Brutally.
      </h1>
      <p className="text-xl font-bold mb-12 bg-yellow-300 px-4 py-2 border-2 border-black">
        TaskForge helps you get things done with no distractions.
      </p>
      <Link href="/signup">
        <Button className="text-xl px-12 py-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px]">
          Get Started
        </Button>
      </Link>
    </div>
  );
}
