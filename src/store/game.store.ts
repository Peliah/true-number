import { create } from 'zustand';
import { forfietGame, getAllGamesAction, getGameByIdAction, joinGameAction, playTurnAction } from '@/actions/game';
import { EventType, GameStatusFilter, type GameRoom } from '@/type/types';
import { toast } from 'sonner';
import { getSocket } from '@/lib/sockets';

interface GameStore {
    gameRooms: GameRoom[];
    isLoading: boolean;
    error: string | null;
    statusFilter: GameStatusFilter;
    addGame: (game: GameRoom) => void;
    fetchRooms: (status?: GameStatusFilter) => Promise<void>;
    joinRoom: (roomId: string) => Promise<void>;
    updateGameRoom: (updatedRoom: GameRoom) => void;
    getGameRoom: (roomId: string) => Promise<GameRoom>;
    playGame: (roomId: string, generatedNumber: number) => Promise<GameRoom | undefined>;
    forfeitGame: (roomId: string) => Promise<GameRoom | undefined>;
    setStatusFilter?: (filter: GameStatusFilter) => void;
}

export const useGameStore = create<GameStore>((set) => ({
    gameRooms: [],
    isLoading: false,
    error: null,
    statusFilter: 'all',

    addGame: (game) =>
        set((state) => ({
            gameRooms: [game, ...(state.gameRooms || [])],
        })),

    fetchRooms: async (status = 'all') => {
        set({ isLoading: true, error: null });

        try {
            const apiStatus = status === 'all' ? undefined : status;
            const response = await getAllGamesAction(apiStatus);

            if (response?.success) {
                set({ gameRooms: response.games, statusFilter: status });
            } else {
                set({ error: response.error || 'Failed to fetch games' });
            }
        } catch (err) {
            set({ error: (err as Error).message });
        } finally {
            set({ isLoading: false });
        }
    },

    setStatusFilter: (filter) => {
        set({ statusFilter: filter });
    },

    joinRoom: async (roomId) => {
        try {
            const response = await joinGameAction(roomId);
            if (response?.success) {
                toast.success('Joined room successfully ' + response.data._id);

                // Emit joinGameRoom socket event AFTER HTTP success
                const socket = await getSocket();
                socket.emit(EventType.JOIN_GAME, { gameId: roomId });

            } else {
                toast.error('Failed to join room');
            }
        } catch (err) {
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
            toast.error('Error joining room ' + (err as Error).message);
            return undefined;
        }
    },

    playGame: async (roomId, generatedNumber) => {
        try {
            const response = await playTurnAction(roomId, generatedNumber);
            if (response?.success && response.data) {
                const game = response.data;
                toast.success('Played turn successfully ', { description: 'Generated number: ' + game.generatedNumber, });

                // Optionally update the store
                set((state) => ({
                    gameRooms: [
                        game,
                        ...state.gameRooms.filter((r) => r._id !== game._id),
                    ],
                }));

                return game;
            } else {
                toast.error('Failed to play turn');
                return undefined;
            }
        } catch (err) {
            toast.error('Error playing turn ' + (err as Error).message);
            return undefined;
        }
    },
    forfeitGame: async (roomId) => {
        try {
            const response = await forfietGame(roomId);

            if (response?.success && response.data) {
                const game = response.data;
                toast.success('Forfiet game successfully ' + game);

                // Optionally update the store
                set((state) => ({
                    gameRooms: [
                        game,
                        ...state.gameRooms.filter((r) => r._id !== game._id),
                    ],
                }));

                return game;
            } else {
                toast.error('Failed to forfiet game');
                return undefined;
            }
        } catch (err) {
            toast.error('Error forfieting game ' + (err as Error).message);
            return undefined;
        } finally {

        }
    }


}));
