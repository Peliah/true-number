import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface HowToPlayDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function HowToPlayDialog({ open, onOpenChange }: HowToPlayDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>How to Play</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <p>Guess a number between 1 and 100.</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>If you guess correctly, you win 10 points!</li>
                        <li>Each wrong guess costs you 1 point.</li>
                        <li>The game continues until you guess the correct number.</li>
                        <li>After winning, a new target number is generated.</li>
                    </ul>
                </div>
            </DialogContent>
        </Dialog>
    );
}