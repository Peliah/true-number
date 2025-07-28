'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { GameHeader } from '@/components/game/game-header';
import { GameControls } from '@/components/game/game-controls';
import { GameRoom } from '@/type/types';
import { useUserStore } from '@/store/user.store';
import { useGameStore } from '@/store/game.store';
import { usePathname } from 'next/navigation';
import { useGameEvents } from '@/hooks/use-game-event';

export default function GamePage() {
    const params = usePathname().split('/').pop();
    const { user } = useUserStore();
    const { getGameRoom, playGame } = useGameStore();
    const [gameState, setGameState] = useState<GameRoom>();

    useEffect(() => {
        const getActiveGameRoom = async () => {
            if (!params) return;
            const room = await getGameRoom(params);
            if (room) {
                setGameState(room);
            } else {
                toast.error('Room not found');
            }
        };

        getActiveGameRoom();
    }, [getGameRoom, params, user?._id]);

    const generateNumber = async () => {
        if (!user) {
            toast.error('You must be logged in to play');
            return;
        }
        if (!gameState?._id) {
            toast.error('Game not loaded yet');
            return;
        }
        const generatedNumber = Math.floor(Math.random() * 101);
        const updatedGame = await playGame(gameState._id, generatedNumber);

        if (updatedGame) {
            // Only update local state if game is still active (not finished)
            if (updatedGame.status !== 'finished') {
                setGameState(updatedGame);
            }
        }
    };

    // Listen for GAME_FINISHED
    useGameEvents({
        gameId: gameState?._id || '',
        onGameFinished: (finishedGame) => {
            setGameState(finishedGame);
            toast.success('Game finished!');
        },
    });

    return (
        <div className="container mx-auto px-4 py-8 font-roboto-mono">
            {user && gameState && (
                <GameHeader
                    balance={user.balance}
                    bet={gameState.bet}
                />
            )}

            <div className="w-full md:w-1/2 mx-auto">
                <GameControls onGenerateNumber={generateNumber} />
            </div>
        </div>
    );
}
