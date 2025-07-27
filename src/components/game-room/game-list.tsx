'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useGameStore } from '@/store/game.store';
import { useUserStore } from '@/store/user.store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import CreateRoomDialog from './create-room-dialog';
import { Gamepad2Icon } from 'lucide-react';
import { EventType, type GameRoom } from '@/type/types';
import { useGameSocket } from '@/hooks/use-socket-listeners';

export default function GameRoomList() {
    const router = useRouter();
    const { gameRooms, isLoading, error, joinRoom } = useGameStore();
    const { user } = useUserStore();

    //socket listener hook
    useGameSocket();

    const handleJoin = async (room: GameRoom) => {
        if (user?._id === room.creator._id) {
            router.push(`/game/${room._id}`);
        } else {
            await joinRoom(room._id);
            toast.success('Joined room successfully ' + room._id);
            router.push(`/game/${room._id}`);
        }
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
            <header className="flex items-center justify-between w-full">
                <h1 className="text-3xl font-bold flex items-center gap-4">
                    Game Rooms <Gamepad2Icon className="w-10 h-10" />
                </h1>
                <CreateRoomDialog />
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {gameRooms.map((room: GameRoom) => (
                    <Card key={room._id} className="flex flex-col justify-between">
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Room #{room._id.slice(-5).toUpperCase()}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Created by <strong>{room.creator?.username || 'Unknown'}</strong>
                            </p>
                        </CardHeader>

                        <CardContent className="space-y-2 text-sm">
                            <p>
                                <strong>Status:</strong> {room.status}
                            </p>
                            <p>
                                <strong>Bet:</strong> {room.bet} coins
                            </p>
                            <p>
                                <strong>Timeout:</strong> {room.timeout} sec
                            </p>
                            <p>
                                <strong>Joiner:</strong>{' '}
                                {room.joiner?.username ?? (
                                    <span className="italic text-muted-foreground">Waiting...</span>
                                )}
                            </p>

                            {room.status === 'pending' && (
                                <Button
                                    size="sm"
                                    className="mt-3 w-full"
                                    onClick={() => handleJoin(room)}
                                >
                                    {room.creator._id === user?._id ? 'Enter Game' : 'Join Game'}
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
    );
}
