'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { GameHeader } from '@/components/game/game-header';
import { GameControls } from '@/components/game/game-controls';
import { HistoryDialog } from '@/components/game/history-dialog';
import { GameState, GameResult } from '@/type/types';
import { saveGameAction } from '@/actions/game';
import { Navbar } from '@/components/miscellenous/navbar';
import { useUserStore } from '@/store/user.store';

export default function GamePage() {
    const [gameState, setGameState] = useState<GameState>({
        balance: 0,
        history: [],
    });
    const [showHistory, setShowHistory] = useState(false);

    // Get user from store
    const { user, fetchCurrentUser } = useUserStore();

    useEffect(() => {
        fetchCurrentUser();
    }, [fetchCurrentUser]);

    const generateNumber = async () => {
        const generatedNumber = Math.floor(Math.random() * 101);
        let result: 'win' | 'lose';
        let pointsChange: number;

        if (generatedNumber > 70 && generatedNumber <= 100) {
            result = 'win';
            pointsChange = 50;
            toast.success(
                <div className="flex flex-col">
                    <span className="font-bold">You won!</span>
                    <span>Number generated: {generatedNumber}</span>
                    <span className="text-green-500">+50 points</span>
                </div>,
                {
                    duration: 5000,
                }
            );
        } else {
            result = 'lose';
            pointsChange = -35;
            toast.error(
                <div className="flex flex-col">
                    <span className="font-bold">You lost</span>
                    <span>Number generated: {generatedNumber}</span>
                    <span className="text-red-500">-35 points</span>
                </div>,
                {
                    duration: 5000,
                }
            );
        }

        const newBalance = gameState.balance + pointsChange;

        const newResult: GameResult = {
            generatedNumber,
            pointsChange,
            result,
            timestamp: new Date(),
            newBalance,
        };

        setGameState(prev => ({
            balance: newBalance,
            history: [newResult, ...prev.history],
        }));

        try {
            const response = await saveGameAction({
                generatedNumber,
                newBalance,
                result,
                userId: user!._id,
            });

            if (response.success) {
                toast.success('Game result saved successfully!');
            } else {
                toast.error('Failed to save game result.');
            }
        } catch (error) {
            console.error('Error saving game result:', error);
            toast.error('Failed to save game result. Please try again later.');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {user && <Navbar user={user} />}
            <GameHeader
                balance={gameState.balance}
                onHistoryClick={() => setShowHistory(true)}
            />

            <div className='w-full md:w-1/2 mx-auto'>
                <GameControls onGenerateNumber={generateNumber} />
            </div>

            <HistoryDialog
                open={showHistory}
                onOpenChange={setShowHistory}
                history={gameState.history}
            />
        </div>
    );
}