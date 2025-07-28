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
import { GameResultDialog } from '@/components/game-room/game-result-dialog';

export default function GamePage() {
    const params = usePathname().split('/').pop();
    const { user } = useUserStore();
    const { getGameRoom, playGame } = useGameStore();
    const [gameState, setGameState] = useState<GameRoom>();

    const [showWinnerModal, setShowWinnerModal] = useState(false);
    const [winnerName, setWinnerName] = useState('');

    useEffect(() => {
        const getActiveGameRoom = async () => {
            if (!params) return;
            const room = await getGameRoom(params);
            if (room) {
                setGameState(room);
                if (room.status === 'pending') {
                    toast.info('Wait for game to start');
                }
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
        // if (gameState.status === 'finished') {
        //     toast.error('Game already finished');
        //     return;
        // }
        if (gameState.status === 'pending') {
            toast.error('Game not started yet');
            return;
        }
        const generatedNumber = Math.floor(Math.random() * 101);
        const updatedGame = await playGame(gameState._id, generatedNumber);

        if (updatedGame) {
            // if (updatedGame.status !== 'finished') {
            setGameState(updatedGame);
            // }
        }
    };

    // Listen for GAME_FINISHED
    useGameEvents({
        gameId: params ?? '',
        onGameStarted: (updatedGame) => {
            setGameState(updatedGame);
            toast.success('Game started!');
        },
        onGameFinished: (updatedGame) => {
            setGameState(updatedGame);
            // let winner = 'Draw';


            // if (updatedGame.winner) {
            //     console.log(updatedGame);
            //     if (updatedGame.creator === updatedGame.winner) {
            //         winner = updatedGame.creator;
            //     } else if (updatedGame.joiner === updatedGame.winner) {
            //         winner = updatedGame.joiner;
            //     }
            // }

            setWinnerName(updatedGame.winner as string);
            setShowWinnerModal(true);
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

            <GameResultDialog
                open={showWinnerModal}
                winnerId={winnerName}
                onClose={() => setShowWinnerModal(false)}
            />
        </div>
    );
}
