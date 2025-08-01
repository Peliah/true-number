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
import CountdownTimer from '@/components/game-room/game-timer';
import { forfietGame } from '@/actions/game';
import { useRouter } from 'next/navigation';

export default function GamePage() {
    const router = useRouter();
    const params = usePathname().split('/').pop();
    const { user } = useUserStore();
    const { getGameRoom, playGame } = useGameStore();
    const [gameState, setGameState] = useState<GameRoom>();
    const [showWinnerModal, setShowWinnerModal] = useState(false);
    const [winnerName, setWinnerName] = useState('');
    const [timerStop, setTimerStop] = useState(false);

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
        setTimerStop(true);
        if (!user) {
            toast.error('You must be logged in to play');
            return;
        }
        if (!gameState?._id) {
            toast.error('Game not loaded yet');
            return;
        }
        if (gameState.status === 'finished') {
            toast.error('Game already finished');
            return;
        }
        if (gameState.status === 'pending') {
            toast.error('Game not started yet');
            return;
        }

        const generatedNumber = Math.floor(Math.random() * 101);
        const updatedGame = await playGame(gameState._id, generatedNumber);

        if (updatedGame) {
            if (updatedGame.status !== 'finished') {
                setGameState(updatedGame);
            }
        }
    };

    const handleCountComplete = async () => {

        if (!user) {
            toast.error('You must be logged in to play');
            return;
        }
        if (!gameState?._id) {
            toast.error('Game not loaded yet');
            return;
        }
        if (gameState.status === 'finished') {
            toast.error('Game already finished');
            return;
        }
        if (gameState.status === 'pending') {
            toast.error('Game not started yet');
            return;
        }

        toast.warning('Time out! You forfeited the game.');
        const updatedGame = await forfietGame(params!);
        if (updatedGame) {
            setGameState(updatedGame.data);
        }
    }

    // Listen for GAME_FINISHED
    useGameEvents({
        gameId: params ?? '',
        onGameStarted: (updatedGame) => {
            setGameState(updatedGame);
            toast.success('Game started!');
        },
        onGameFinished: (updatedGame) => {
            setGameState(updatedGame);
            setWinnerName(updatedGame.winner as string);
            setShowWinnerModal(true);
            toast.success('Game finished!');
        },
        onPlayerMove: (updatedGame) => {
            // This will trigger when any player makes a move
            setGameState(updatedGame);
            toast.success('Player moved!');
        },
    });
    useEffect(() => {
        setTimerStop(false);
    }, [gameState?.turn]);
    const isMyTurn =
        (gameState?.turn === 1 && (gameState?.creator._id || gameState?.creator) as string === user?._id) ||
        (gameState?.turn === 2 && (gameState?.joiner?._id || gameState?.joiner) === user?._id);

    return (
        <div className="container mx-auto px-4 py-8 font-roboto-mono">
            {user && gameState && (
                <>
                    <GameHeader
                        balance={user.balance}
                        bet={gameState.bet}
                    />
                    {isMyTurn ? (
                        <CountdownTimer
                            initialSeconds={gameState.timeout}
                            onComplete={handleCountComplete}
                            start={gameState.status === 'active' && !timerStop}
                            stop={timerStop}
                        />
                    ) : (
                        <div className="text-center text-xl text-gray-600">
                            It&apos;s opponent&apos;s turn
                        </div>
                    )}
                </>
            )}

            <div className="w-full md:w-1/2 mx-auto">
                <GameControls onGenerateNumber={generateNumber} />
                {gameState && (
                    <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-3">Generated Numbers</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-3 rounded shadow-sm">
                                <p className="text-sm text-gray-500">Your number</p>
                                <p className="text-xl font-bold">
                                    {user?._id === (gameState.creator._id || gameState.creator) as string
                                        ? gameState.creatorNumber || 'Not generated yet'
                                        : gameState.joinerNumber || 'Not generated yet'}
                                </p>
                            </div>

                            <div className="bg-white p-3 rounded shadow-sm">
                                <p className="text-sm text-gray-500">Opponent&apos;s number</p>
                                <p className="text-xl font-bold">
                                    {user?._id === (gameState.creator._id || gameState.creator) as string
                                        ? gameState.joinerNumber || 'Waiting...'
                                        : gameState.creatorNumber || 'Waiting...'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <GameResultDialog
                open={showWinnerModal}
                winnerId={winnerName}
                onClose={() => { setShowWinnerModal(false); router.push('/game'); }}
            />
        </div>
    );
}