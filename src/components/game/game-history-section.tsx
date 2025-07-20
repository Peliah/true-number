'use client';

import { GameHistoryTable } from './game-history-table';
import { GameResult } from '@/type/types';

interface GameHistorySectionProps {
    history: GameResult[];
    isLoading: boolean;
}

export function GameHistorySection({ history, isLoading }: GameHistorySectionProps) {
    return (
        <div className="mt-8 w-full md:w-3/4 mx-auto">
            <h2 className="text-xl font-semibold mb-4">Recent Games</h2>
            <GameHistoryTable data={history} isLoading={isLoading} />
        </div>
    );
}