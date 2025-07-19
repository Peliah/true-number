// components/navbar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { User } from '@/type/types';
import { LogOut } from 'lucide-react';

interface NavbarProps {
    user: User
}

export function Navbar({ user }: NavbarProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const handleLogout = () => {
        // Call your logout logic here (e.g., signOut from next-auth or clearing token)
        console.log(user);
        // router.push('/login');
    };

    return (
        <nav className="w-full flex items-center justify-between px-6 py-4 bg-white border-b shadow-sm">
            <Link href="/" className="text-xl font-bold text-black">
                True Number
            </Link>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button className="flex items-center gap-2 rounded-full bg-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-300">
                        {user.username}
                    </button>
                </PopoverTrigger>

                <PopoverContent
                    sideOffset={10}
                    className="bg-white border shadow-lg rounded-lg p-4 w-48 z-50"
                >
                    <div className="flex flex-col gap-2 text-sm">
                        <Link
                            href="/profile"
                            onClick={() => setOpen(false)}
                            className="hover:bg-gray-100 px-3 py-2 rounded"
                        >
                            {user.username}
                        </Link>

                        {user.role === 'admin' && (
                            <Link
                                href="/dashboard"
                                onClick={() => setOpen(false)}
                                className="hover:bg-gray-100 px-3 py-2 rounded"
                            >
                                Dashboard
                            </Link>
                        )}

                        <button
                            onClick={handleLogout}
                            className="text-left hover:bg-gray-100 px-3 py-2 rounded text-red-500 flex items-center"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </button>
                    </div>
                </PopoverContent>
            </Popover>
        </nav>
    );
}
