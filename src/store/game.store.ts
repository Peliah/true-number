import { create } from 'zustand';
import { getAllGamesAction, getGameByIdAction, joinGameAction, playTurnAction } from '@/actions/game';
import { EventType, type GameRoom } from '@/type/types';
import { toast } from 'sonner';
import { getSocket } from '@/lib/sockets';

interface GameStore {
    gameRooms: GameRoom[];
    isLoading: boolean;
    error: string | null;
    addGame: (game: GameRoom) => void;
    fetchRooms: () => Promise<void>;
    joinRoom: (roomId: string) => Promise<void>;
    updateGameRoom: (updatedRoom: GameRoom) => void;
    getGameRoom: (roomId: string) => Promise<GameRoom>;
    playGame: (roomId: string, generatedNumber: number) => Promise<GameRoom | undefined>;
}

export const useGameStore = create<GameStore>((set) => ({
    gameRooms: [],
    isLoading: false,
    error: null,

    addGame: (game) =>
        set((state) => ({
            gameRooms: [game, ...(state.gameRooms || [])],
        })),

    fetchRooms: async () => {
        set({ isLoading: true, error: null });

        try {
            const response = await getAllGamesAction();

            if (response?.success) {
                set({ gameRooms: response.games });
            } else {
                set({ error: response.error || 'Failed to fetch games' });
            }
        } catch (err) {
            set({ error: (err as Error).message });
        } finally {
            set({ isLoading: false });
        }
    },

    joinRoom: async (roomId) => {
        try {
            const response = await joinGameAction(roomId);
            if (response?.success) {
                console.log('Joined room successfully:', response.data);
                toast.success('Joined room successfully ' + response.data._id);

                // Emit joinGameRoom socket event AFTER HTTP success
                const socket = await getSocket();
                socket.emit(EventType.JOIN_GAME, { gameId: roomId });
                console.log('🎮 Emitted JOIN_GAME_ROOM:', roomId);

            } else {
                console.error('Failed to join room:', response.error);
                toast.error('Failed to join room');
            }
        } catch (err) {
            console.error('Error joining room:', err);
            toast.error('Error joining room ' + (err as Error).message);
        }
    },
    updateGameRoom: (room: GameRoom) =>
        set((state) => ({
            gameRooms: [
                room,
                ...state.gameRooms.filter((r) => r._id !== room._id),
            ],
        })),

    getGameRoom: async (roomId) => {
        try {
            const response = await getGameByIdAction(roomId);
            if (response?.success) {
                return response.data;
            } else {
                return undefined;
            }
        } catch (err) {
            console.error('Error joining room:', err);
            toast.error('Error joining room ' + (err as Error).message);
            return undefined;
        }
    },

    playGame: async (roomId, generatedNumber) => {
        try {
            const response = await playTurnAction(roomId, generatedNumber);
            if (response?.success && response.data) {
                const game = response.data;
                console.log('Played turn successfully:', game);
                toast.success('Played turn successfully ' + game, { description: 'Generated number: ' + game.generatedNumber, });

                // Optionally update the store
                set((state) => ({
                    gameRooms: [
                        game,
                        ...state.gameRooms.filter((r) => r._id !== game._id),
                    ],
                }));

                return game;
            } else {
                console.error('Failed to play turn:', response.error);
                toast.error('Failed to play turn');
                return undefined;
            }
        } catch (err) {
            console.error('Error playing turn:', err);
            toast.error('Error playing turn ' + (err as Error).message);
            return undefined;
        }
    },


}));
