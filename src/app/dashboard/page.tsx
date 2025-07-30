"use client";

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Users, Gamepad2, Activity } from 'lucide-react'
import { useDashboardStore } from '@/store/dashboard.store'
import StatsCard from '@/components/miscellenous/stat-card';
import { useGameStore } from '@/store/game.store';
import { toast } from 'sonner';

const DashboardPage = () => {
    const router = useRouter()

    // Zustand store hooks - use direct property access instead of selectors
    const {
        fetchDashboardData,
        resetErrors,
        usersCount,
        usersLoading,
        historyLoading,
        usersError,
        historyError
    } = useDashboardStore()
    const { gameRooms } = useGameStore()

    useEffect(() => {
        fetchDashboardData()
        const interval = setInterval(() => {
            fetchDashboardData()
        }, 5 * 60 * 1000)

        return () => clearInterval(interval)
    }, [fetchDashboardData])

    const handleUsersClick = () => {
        router.push('/dashboard/users')
    }

    const handleHistoryClick = () => {
        router.push('/history')
    }

    const handleRefresh = () => {
        resetErrors()
        fetchDashboardData()
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start mt-4">
                <button
                    onClick={handleRefresh}
                    className="px-3 py-2 text-sm bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors duration-200 flex items-center space-x-2"
                >
                    <Activity className="w-4 h-4" />
                    <span>Refresh</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Users"
                    count={usersCount}
                    icon={<Users className="w-5 h-5 text-primary" />}
                    description="Registered users on your platform"
                    onClick={handleUsersClick}
                    loading={usersLoading}
                    error={usersError}
                    trend={{ value: 12.5, isPositive: true }}
                />

                <StatsCard
                    title="Games Played"
                    count={gameRooms.length}
                    icon={<Gamepad2 className="w-5 h-5 text-primary" />}
                    description="Total games completed by all users"
                    onClick={handleHistoryClick}
                    loading={historyLoading}
                    error={historyError}
                    trend={{ value: 8.3, isPositive: true }}
                />

                {/* <StatsCard
                    title="Active Today"
                    count={89}
                    icon={<Activity className="w-5 h-5 text-primary" />}
                    description="Users active in the last 24 hours"
                    onClick={() => router.push('/dashboard/')}
                    trend={{ value: 23.1, isPositive: true }}
                />

                <StatsCard
                    title="Avg. Session"
                    count={24}
                    icon={<TrendingUp className="w-5 h-5 text-primary" />}
                    description="Average session duration (minutes)"
                    onClick={() => router.push('/dashboard/')}
                    trend={{ value: 5.2, isPositive: false }}
                /> */}
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={handleUsersClick}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200 text-sm font-medium"
                    >
                        View All Users
                    </button>
                    <button
                        onClick={() => { toast.info('Feature coming soon...') }}
                        className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors duration-200 text-sm font-medium"
                    >
                        View Game History
                    </button>
                    {/* <button
                        onClick={() => toast.info('Feature coming soon...')}
                        className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors duration-200 text-sm font-medium"
                    >
                        Analytics
                    </button> */}
                </div>
            </div>
        </div>
    )
}

export default DashboardPage