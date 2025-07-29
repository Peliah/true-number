import { create } from 'zustand'
import { getAllHistoryAction } from '@/actions/history'
import { getAllUsersAction } from '@/actions/user'
import { History, User } from '@/type/types'

interface DashboardState {
    users: User[]
    history: History[]

    usersLoading: boolean
    historyLoading: boolean

    usersError: string | null
    historyError: string | null

    usersCount: number
    gamesPlayedCount: number

    fetchUsers: () => Promise<void>
    fetchHistory: () => Promise<void>
    fetchDashboardData: () => Promise<void>
    resetErrors: () => void
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
    users: [],
    history: [],
    usersLoading: false,
    historyLoading: false,
    usersError: null,
    historyError: null,
    usersCount: 0,
    gamesPlayedCount: 0,

    fetchUsers: async () => {
        set({ usersLoading: true, usersError: null })

        try {
            const result = await getAllUsersAction()
            if (result.success) {
                set({
                    users: result.users || [],
                    usersCount: result.total || 0,
                    usersLoading: false
                })
            } else {
                set({
                    usersError: result.error || 'Failed to fetch users',
                    usersLoading: false
                })
            }
        } catch (error) {
            set({
                usersError: error instanceof Error ? error.message : 'Failed to fetch users',
                usersLoading: false
            })
        }
    },

    // Fetch history action
    fetchHistory: async () => {
        set({ historyLoading: true, historyError: null })

        try {
            const result = await getAllHistoryAction()

            if (result.success) {
                set({
                    history: result.history || [],
                    gamesPlayedCount: result.history?.length || 0,
                    historyLoading: false
                })
            } else {
                set({
                    historyError: result.error || 'Failed to fetch history',
                    historyLoading: false
                })
            }
        } catch (error) {
            set({
                historyError: error instanceof Error ? error.message : 'Failed to fetch history',
                historyLoading: false
            })
        }
    },

    // Fetch all dashboard data
    fetchDashboardData: async () => {
        const { fetchUsers, fetchHistory } = get()
        await Promise.all([fetchUsers(), fetchHistory()])
    },

    // Reset errors
    resetErrors: () => {
        set({ usersError: null, historyError: null })
    }
}))

// Optional: Create selectors for better performance
export const selectUsersData = (state: DashboardState) => ({
    users: state.users,
    count: state.usersCount,
    loading: state.usersLoading,
    error: state.usersError
})

export const selectHistoryData = (state: DashboardState) => ({
    history: state.history,
    count: state.gamesPlayedCount,
    loading: state.historyLoading,
    error: state.historyError
})

export const selectDashboardStats = (state: DashboardState) => ({
    usersCount: state.usersCount,
    gamesPlayedCount: state.gamesPlayedCount,
    loading: state.usersLoading || state.historyLoading,
    hasErrors: Boolean(state.usersError || state.historyError)
})