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
}

export type GameStatus = 'pending' | 'active' | 'finished';

export type Player = {
    _id: string;
    username: string;
};

export interface GameRoom {
    _id: string;
    creator: Player;
    joiner?: Player | null;
    bet: number;
    timeout: number;
    status: GameStatus;
    turn: 1 | 2;
    creatorNumber?: number;
    joinerNumber?: number;
    winner?: Player | string;
    createdAt: string;
    updatedAt: string;
}

export enum EventType {
    GAME_CREATED = 'gameCreated',
    GAME_STARTED = 'gameStarted',
    GAME_FINISHED = 'gameFinished',
    JOIN_GAME = 'joinGameRoom',
    PLAYER_FORFEIT = 'playerForfeit',
    PLAYER_MOVE = 'playerMove',
}