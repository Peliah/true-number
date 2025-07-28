'use client';

import { useEffect } from 'react';
import { getSocket } from '@/lib/sockets';
import { EventType, type GameRoom } from '@/type/types';
import { useGameStore } from '@/store/game.store';

type UseGameEventsProps = {
    gameId: string;
    onGameStarted?: (game: GameRoom) => void;
    onGameFinished?: (game: GameRoom) => void;
};

export function useGameEvents({ gameId, onGameFinished, onGameStarted }: UseGameEventsProps) {
    const { updateGameRoom } = useGameStore();

    useEffect(() => {
        if (!gameId) return;

        let isMounted = true;

        const setup = async () => {
            const socket = await getSocket();

            socket.emit(EventType.JOIN_GAME, { gameId });

            socket.on(EventType.GAME_STARTED, (game: GameRoom) => {
                console.log('🎮 GAME_STARTED received:', game);
                updateGameRoom(game);
                onGameStarted?.(game);
            });

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
                socket.off(EventType.GAME_STARTED);
                socket.off(EventType.GAME_FINISHED);
            });
        };
    }, [gameId, onGameFinished, updateGameRoom]);
}
