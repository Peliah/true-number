'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { LogInIcon, LogOut, UserIcon } from 'lucide-react';
import { useUserStore } from '@/store/user.store';


export function Navbar() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const { user, fetchCurrentUser, logout } = useUserStore();

    useEffect(() => {
        fetchCurrentUser();
    }, [fetchCurrentUser]);

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    return (
        <nav className="w-full flex items-center justify-between px-6 py-4 bg-white border-b shadow-sm">
            <Link href="/" className="text-xl font-bold text-black">
                True Number
            </Link>

            {user ? (
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
                                className="hover:bg-gray-100 px-3 py-2 rounded flex items-center"
                            >
                                <UserIcon className="mr-2 h-4 w-4" />
                                Profile
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
            ) : (
                <Link
                    href="/"
                    className="text-sm font-medium text-blue-600 hover:underline"
                >
                    <LogInIcon className="mr-2 h-4 w-4" />
                </Link>
            )}
        </nav>
    );
}
