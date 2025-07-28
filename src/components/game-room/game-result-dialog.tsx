'use client';

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { getUserByIdAction } from '@/actions/user';

interface GameResultDialogProps {
    open: boolean;
    winnerId: string;
    onClose: () => void;
}

export function GameResultDialog({ open, winnerId, onClose }: GameResultDialogProps) {
    const [winnerName, setWinnerName] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open && winnerId !== 'Draw') {
            const fetchWinner = async () => {
                setIsLoading(true);
                setError(null);
                try {
                    const result = await getUserByIdAction(winnerId);
                    console.log(result);

                    setWinnerName(result.user.username);
                } catch (err) {
                    setError('Failed to load winner');
                    console.error(err);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchWinner();
        }
    }, [open, winnerId]);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>🏁 Game Over</DialogTitle>
                </DialogHeader>
                <div className="text-center text-lg font-semibold">
                    {winnerId === 'Draw' ? (
                        "It's a draw!"
                    ) : isLoading ? (
                        "Loading winner details..."
                    ) : error ? (
                        error
                    ) : (
                        `${winnerName || 'Unknown player'} wins!`
                    )}
                </div>
                <DialogFooter>
                    <Button onClick={onClose}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}