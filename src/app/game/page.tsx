'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { GameHeader } from '@/components/game/game-header';
import { GameControls } from '@/components/game/game-controls';
import { HistoryDialog } from '@/components/game/history-dialog';
import { GameState, GameResult } from '@/type/types';

export default function GamePage() {
    const [gameState, setGameState] = useState<GameState>({
        balance: 0,
        history: [],
    });

    const [showHistory, setShowHistory] = useState(false);

    const generateNumber = () => {
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
            history: [newResult, ...prev.history], // Newest first
        }));
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <GameHeader
                balance={gameState.balance}
                onHistoryClick={() => setShowHistory(true)}
            />

            <GameControls onGenerateNumber={generateNumber} />

            <HistoryDialog
                open={showHistory}
                onOpenChange={setShowHistory}
                history={gameState.history}
            />
        </div>
    );
}