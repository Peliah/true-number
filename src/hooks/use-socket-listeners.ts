// hooks/useGameSocket.ts
'use client';

import { useEffect } from 'react';
import { getSocket } from '@/lib/sockets';
import { useGameStore } from '@/store/game.store';
import { useUserStore } from '@/store/user.store';
import { EventType, type GameRoom } from '@/type/types';

export function useGameSocket() {
    const { addGame, updateGameRoom, fetchRooms } = useGameStore();
    const { user } = useUserStore();

    useEffect(() => {
        let socket: ReturnType<typeof getSocket> | null = null;

        const setupSocket = async () => {
            await fetchRooms();
            socket = getSocket();

            (await socket).on('connect', async () => {
                console.log('✅ Socket connected with id:', (await socket!).id);
            });

            (await socket).on('connect_error', (err) => {
                console.error('❌ Socket connection error:', err.message);
            });

            (await socket).on('disconnect', (reason) => {
                console.warn('⚠️ Socket disconnected:', reason);
            });

            (await socket).on(EventType.GAME_CREATED, async (newRoom: GameRoom) => {
                addGame(newRoom);

                if (user?._id === newRoom.creator._id && socket) {
                    (await socket).emit(EventType.JOIN_GAME, { gameId: newRoom._id });
                }
            });

            (await socket).on(EventType.GAME_STARTED, (updatedRoom: GameRoom) => {
                console.log('🚀 GAME_STARTED received:', updatedRoom);
                updateGameRoom(updatedRoom);
            });
        };

        setupSocket();

        return () => {
            if (socket) {
                Promise.resolve(socket).then(s => {
                    s.off(EventType.GAME_CREATED);
                    s.off(EventType.JOIN_GAME);
                    s.off(EventType.GAME_STARTED);
                    s.off('connect');
                    s.off('connect_error');
                    s.off('disconnect');
                });
            }
        };
    }, [addGame, updateGameRoom, fetchRooms, user]);
}
