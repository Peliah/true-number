import { GameResult } from '@/type/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, X } from 'lucide-react';

interface GameHistoryProps {
    history: GameResult[];
}

export function GameHistory({ history }: GameHistoryProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Number</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>New Balance</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {history.map((game, index) => (
                    <TableRow key={index}>
                        <TableCell>
                            {game.timestamp.toLocaleTimeString()}
                        </TableCell>
                        <TableCell>{game.generatedNumber}</TableCell>
                        <TableCell>
                            {game.result === 'win' ? (
                                <div className="flex items-center text-green-500">
                                    <Check className="mr-1 h-4 w-4" /> Win
                                </div>
                            ) : (
                                <div className="flex items-center text-red-500">
                                    <X className="mr-1 h-4 w-4" /> Lose
                                </div>
                            )}
                        </TableCell>
                        <TableCell className={game.pointsChange > 0 ? 'text-green-500' : 'text-red-500'}>
                            {game.pointsChange > 0 ? `+${game.pointsChange}` : game.pointsChange}
                        </TableCell>
                        <TableCell className="font-medium">
                            {game.newBalance}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}