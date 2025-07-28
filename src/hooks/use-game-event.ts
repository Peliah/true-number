'use client';

import { useEffect } from 'react';
import { getSocket } from '@/lib/sockets';
import { EventType, type GameRoom } from '@/type/types';
import { useGameStore } from '@/store/game.store';

type UseGameEventsProps = {
    gameId: string;
    onGameFinished?: (game: GameRoom) => void;
};

export function useGameEvents({ gameId, onGameFinished }: UseGameEventsProps) {
    const { updateGameRoom } = useGameStore();

    useEffect(() => {
        if (!gameId) return;

        let isMounted = true;

        const setup = async () => {
            const socket = await getSocket();

            // Join the game room for this gameId
            socket.emit(EventType.JOIN_GAME, { gameId });

            // Listen for the game finished event only
            socket.on(EventType.GAME_FINISHED, (game: GameRoom) => {
                if (!isMounted) return;
                console.log('🏁 GAME_FINISHED received:', game);
                updateGameRoom(game);
                onGameFinished?.(game);
            });
        };

        setup();

        return () => {
            isMounted = false;
            getSocket().then((socket) => {
                socket.off(EventType.GAME_FINISHED);
            });
        };
    }, [gameId, onGameFinished, updateGameRoom]);
}
