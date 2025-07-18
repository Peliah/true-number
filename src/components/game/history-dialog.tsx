import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { GameHistory } from './game-history';
import { GameResult } from '@/type/types';

interface HistoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    history: GameResult[];
}

export function HistoryDialog({ open, onOpenChange, history }: HistoryDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Game History</DialogTitle>
                </DialogHeader>

                <GameHistory history={history} />
            </DialogContent>
        </Dialog>
    );
}