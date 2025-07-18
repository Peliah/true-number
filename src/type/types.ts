export type GameResult = {
    generatedNumber: number;
    pointsChange: number;
    result: 'win' | 'lose';
    timestamp: Date;
    newBalance: number;
};

export type GameState = {
    balance: number;
    history: GameResult[];
};