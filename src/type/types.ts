export type GameResult = {
    generatedNumber: number;
    balanceChange: number;
    result: 'win' | 'lose';
    date: Date;
    newBalance: number;
};

export type GameState = {
    balance: number;
    history: GameResult[];
};

export interface Game {
    userId: string;
    generatedNumber: number;
    newBalance: number;
    result: 'win' | 'lose';
}

export interface History {
    userId: string;
    gameId: string;
    guessedNumber: number;
    generatedNumber: number;
    result: 'win' | 'lose';
    newBalance: number;
    balanceChange: number;
    date: Date;
}

export interface User {
    _id: string;
    username: string;
    email: string;
    role: 'user' | 'admin';
    firstName?: string;
    lastName?: string;
    phone: string;
    profilePicture?: string;
    bio?: string;
    balance: number;
    createdAt: Date;
    updatedAt: Date;
}