// stores/user-store.ts
import { create } from 'zustand';
import { User } from '@/type/types';
import { getCurrentUserAction } from '@/actions/user';
import { logoutAction } from '@/actions/auth';

interface UserStore {
    user: User | null;
    loading: boolean;
    error: string | null;
    setUser: (user: User | null) => void;
    fetchCurrentUser: () => Promise<void>;
    clearUser: () => void;
    logout: () => Promise<void>; // ✅ new
}

export const useUserStore = create<UserStore>((set, get) => ({
    user: null,
    loading: false,
    error: null,

    setUser: (user) => set({ user }),

    fetchCurrentUser: async () => {
        set({ loading: true, error: null });
        try {
            const { error, user } = await getCurrentUserAction();
            if (error) {
                set({ error });
            } else if (user) {
                set({ user });
            }
        } catch (err) {
            set({ error: 'Failed to fetch user data' });
            console.error(err);
        } finally {
            set({ loading: false });
        }
    },

    clearUser: () => set({ user: null }),

    logout: async () => {
        try {
            await logoutAction();
        } catch (error) {
            console.error('Logout failed:', error);
        }
        get().clearUser();
    },
}));
