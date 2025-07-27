'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/store/game.store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { GameRoom } from '@/type/types';

export default function GameRoomList() {
    const {
        gameRooms,
        fetchRooms,
        isLoading,
        error,
    } = useGameStore();

    useEffect(() => {
        fetchRooms();
    }, []);

    const handleJoin = (roomId: string) => {
        console.log(`Joining room ${roomId}...`);
        // Call joinRoom() here when implemented
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gameRooms && gameRooms.map((room: GameRoom) => (
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
                        <p><strong>Status:</strong> {room.status}</p>
                        <p><strong>Bet:</strong> {room.bet} coins</p>
                        <p><strong>Timeout:</strong> {room.timeout} sec</p>
                        <p>
                            <strong>Joiner:</strong>{' '}
                            {room.joiner?.username ?? <span className="italic text-muted-foreground">Waiting...</span>}
                        </p>

                        {room.status === 'pending' && (
                            <Button
                                size="sm"
                                className="mt-3 w-full"
                                onClick={() => handleJoin(room._id)}
                            >
                                Join Game
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
