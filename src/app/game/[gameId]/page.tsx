'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { GameHeader } from '@/components/game/game-header';
import { GameControls } from '@/components/game/game-controls';
import { GameHistorySection } from '@/components/game/game-history-section';
import { GameState, GameResult } from '@/type/types';
import { saveGameAction } from '@/actions/game';
import { useUserStore } from '@/store/user.store';
import { getHistoryAction } from '@/actions/history';

export default function GamePage() {
    const [gameState, setGameState] = useState<GameState>({
        balance: 0,
        history: [],
    });
    const [loadingHistory, setLoadingHistory] = useState(false);
    const { user } = useUserStore();

    useEffect(() => {
        const fetchHistory = async () => {
            if (!user?._id) return;

            setLoadingHistory(true);
            try {
                const response = await getHistoryAction();
                if (response.success && response.history) {
                    setGameState(prev => ({
                        ...prev,
                        history: response.history
                    }));
                }
            } catch (error) {
                console.error('Error fetching history:', error);
                toast.error('Failed to load game history');
            } finally {
                setLoadingHistory(false);
            }
        };

        fetchHistory();
    }, [user?._id]);

    const generateNumber = async () => {
        if (!user) {
            toast.error('You must be logged in to play');
            return;
        }

        const generatedNumber = Math.floor(Math.random() * 101);
        const result = generatedNumber > 70 ? 'win' : 'lose';
        const balanceChange = result === 'win' ? 50 : -35;

        (result === 'win' ? toast.success : toast.error)(
            <div className="flex flex-col">
                <span className="font-bold">You {result}!</span>
                <span>Number generated: {generatedNumber}</span>
                <span className={result === 'win' ? 'text-green-500' : 'text-red-500'}>
                    {balanceChange > 0 ? '+' : ''}{balanceChange} points
                </span>
            </div>,
            { duration: 5000 }
        );

        const newBalance = (gameState.history.at(-1)?.newBalance ?? 0) + balanceChange;
        const newResult: GameResult = {
            generatedNumber,
            balanceChange,
            result,
            date: new Date(),
            newBalance,
        };

        // Update local state immediately
        setGameState(prev => ({
            balance: newResult.newBalance,
            history: [...prev.history, newResult],
        }));

        try {
            const response = await saveGameAction({
                generatedNumber,
                newBalance,
                result,
                userId: user._id,
            });

            if (!response.success) {
                throw new Error('Failed to save game');
            }
        } catch (error) {
            console.error('Error saving game result:', error);
            toast.error('Failed to save game result');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 font-roboto-mono">
            <GameHeader
                balance={gameState.history.at(-1)?.newBalance ?? 0}
            />

            <div className='w-full md:w-1/2 mx-auto'>
                <GameControls onGenerateNumber={generateNumber} />
            </div>

            <GameHistorySection
                history={gameState.history}
                isLoading={loadingHistory}
            />
        </div>
    );
}