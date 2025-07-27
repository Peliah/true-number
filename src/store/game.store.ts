import { create } from 'zustand';
import { getAllGamesAction } from '@/actions/game';
import type { GameRoom } from '@/type/types';

interface GameStore {
    gameRooms: GameRoom[];
    isLoading: boolean;
    error: string | null;
    addGame: (game: GameRoom) => void;
    fetchRooms: () => Promise<void>;
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
}));
