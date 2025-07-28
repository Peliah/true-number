'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
// import { useToast } from '@/components/ui/use-toast';
import { createGameAction } from '@/actions/game';
import { useGameStore } from '@/store/game.store';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { GameRoom } from '@/type/types';
import { useRouter } from 'next/navigation';

export default function CreateRoomDialog() {
    const [bet, setBet] = useState('');
    const [timeout, setTimeout] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const router = useRouter();

    //   const { toast } = useToast();
    const addGame = useGameStore((s) => s.addGame);

    const handleCreateRoom = async () => {
        const betVal = Number(bet);
        const timeoutVal = Number(timeout);

        if (betVal < 1 || timeoutVal < 10) {
            toast.error('Invalid input', { description: 'Bet must be >= 1 and timeout >= 10' });
            return;
        }

        try {
            setIsCreating(true);
            const newGame = await createGameAction({ bet: betVal, timeout: timeoutVal } as GameRoom);
            toast('Room created!', { description: 'Game room successfully created ' + newGame.data._id });
            addGame(newGame.data);
            router.push(`/game/${newGame.data._id}`);
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error("Error", {
                    description: error?.response?.data?.message || 'Failed to create game room',
                });
            }
            console.error(error);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Create Room</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create a New Game Room</DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleCreateRoom();
                    }}
                    className="space-y-4 mt-4"
                >
                    <div>
                        <label className="block mb-1 font-medium">Bet (coins)</label>
                        <Input
                            type="number"
                            min={1}
                            value={bet}
                            onChange={(e) => setBet(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Timeout (seconds)</label>
                        <Input
                            type="number"
                            min={10}
                            value={timeout}
                            onChange={(e) => setTimeout(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex justify-end space-x-2">
                        <DialogClose asChild>
                            <Button variant="outline" type="button">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={isCreating}>
                            {isCreating ? 'Creating...' : 'Create'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
