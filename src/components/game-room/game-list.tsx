'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useGameStore } from '@/store/game.store';
import { useUserStore } from '@/store/user.store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import CreateRoomDialog from './create-room-dialog';
import { CoinsIcon, Gamepad2Icon, PersonStandingIcon, TimerIcon } from 'lucide-react';
import { type GameRoom } from '@/type/types';
import { useGameSocket } from '@/hooks/use-socket-listeners';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export default function GameRoomList() {
    const router = useRouter();
    const { gameRooms, isLoading, error, joinRoom, updateGameRoom, fetchRooms, statusFilter } = useGameStore();
    const { user } = useUserStore();

    //socket listener hook
    useGameSocket();

    const handleJoin = async (room: GameRoom) => {
        if (user?._id === room.creator._id) {
            router.push(`/game/${room._id}`);
        } else {
            await joinRoom(room._id);
            toast.success('Joined room successfully ' + room._id);
            updateGameRoom(room);
            router.push(`/game/${room._id}`);
        }
    };

    // filter controls
    const handleFilterChange = (filter: 'all' | 'pending' | 'active' | 'finished') => {
        fetchRooms(filter);
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-40 rounded-xl" />
                ))}
            </div>
        );
    }

    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <>
            <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4 sm:gap-0 mb-4">
                <div className="w-full sm:w-auto">
                    <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 sm:gap-4">
                        Game Rooms <Gamepad2Icon className="w-8 h-8 sm:w-10 sm:h-10" />
                    </h1>
                </div>

                <div className="w-full sm:w-auto font-roboto-mono flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                    <div className="order-2 sm:order-1 w-full sm:w-auto">
                        <Select
                            value={statusFilter}
                            onValueChange={(value) => handleFilterChange(value as typeof statusFilter)}
                        >
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent className='font-roboto-mono'>
                                <SelectItem value="all">All Games</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="finished">Finished</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="order-1 sm:order-2 w-full sm:w-auto flex justify-end">
                        <CreateRoomDialog />
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {gameRooms?.map((room: GameRoom) => (
                    <Card
                        key={room._id || Math.random().toString(36).substring(2, 9)}
                        className={`flex flex-col justify-between border-l-4 ${room.status === 'pending'
                                ? 'border-l-yellow-400 hover:bg-yellow-50'
                                : room.status === 'active'
                                    ? 'border-l-green-400 hover:bg-green-50'
                                    : 'border-l-gray-400 hover:bg-gray-50'
                            } transition-colors`}
                    >
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-lg">
                                        Room #{room._id?.slice(-5)?.toUpperCase() || 'N/A'}
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        Created by <strong>{room.creator?.username || 'Unknown'}</strong>
                                    </p>
                                </div>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${room.status === 'pending'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : room.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}
                                >
                                    {room.status
                                        ? room.status.charAt(0).toUpperCase() + room.status.slice(1)
                                        : 'Unknown'}
                                </span>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-3 text-sm">
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <p className="text-muted-foreground flex items-center gap-2">
                                        <CoinsIcon className="w-4 h-4" />
                                        Bet
                                    </p>
                                    <p className="font-medium">{room.bet || 0} coins</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground flex items-center gap-2">
                                        <TimerIcon className="w-4 h-4" />
                                        Timeout
                                    </p>
                                    <p className="font-medium">{room.timeout || 0} sec</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-muted-foreground flex items-center gap-2">
                                    <PersonStandingIcon className="w-4 h-4" />
                                    Joiner
                                </p>
                                <p className="font-medium">
                                    {room.joiner?.username || (
                                        <span className="italic text-muted-foreground">Waiting...</span>
                                    )}
                                </p>
                            </div>

                            {room.status === 'pending' && (
                                <Button
                                    size="sm"
                                    className={`mt-3 w-full ${room.creator?._id === user?._id
                                            ? 'bg-yellow-600 hover:bg-yellow-700'
                                            : 'bg-green-600 hover:bg-green-700'
                                        }`}
                                    onClick={() => handleJoin(room)}
                                    disabled={!room._id} // Disable if no room ID
                                >
                                    {room.creator?._id === user?._id ? 'Enter Game' : 'Join Game'}
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
    );
}
