'use client';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface GameControlsProps {
    onGenerateNumber: () => void;
}

export function GameControls({ onGenerateNumber }: GameControlsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Number Generator Game</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Click the button to generate a number between 0-100
                    </p>
                    <Button
                        onClick={onGenerateNumber}
                        className="w-full py-10"
                        size="lg"
                    >
                        Generate Number
                    </Button>
                    <div className="text-sm space-y-2">
                        <p>● Win: Number &gt; 70 → +50 points</p>
                        <p>● Lose: Number ≤ 70 → -35 points</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}