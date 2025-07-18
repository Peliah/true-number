import { Button } from '@/components/ui/button';
import { History } from 'lucide-react';

interface GameHeaderProps {
    balance: number;
    onHistoryClick: () => void;
}

export function GameHeader({ balance, onHistoryClick }: GameHeaderProps) {
    return (
        <div className="flex justify-between items-center mb-8">
            <div className="text-2xl font-bold">
                Balance: <span className={balance >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {balance} points
                </span>
            </div>

            <Button variant="outline" onClick={onHistoryClick}>
                <History className="mr-2 h-4 w-4" />
                Game History
            </Button>
        </div>
    );
}