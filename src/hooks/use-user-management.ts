'use client';

import { toast } from 'sonner';
import { useDashboardStore } from '@/store/dashboard.store';
import { deleteUserByIdAction } from '@/actions/user';

export function useUserManagement() {
    const { fetchDashboardData } = useDashboardStore();

    const handleDeleteUser = async (userId: string) => {
        try {
            const result = await deleteUserByIdAction(userId);

            if (result.error) {
                toast.error(result.error.message);
                return;
            }
            toast.success('User deleted successfully');

            // Refresh the user list
            await fetchDashboardData();
        } catch (error) {
            toast.error('Failed to delete user');
            console.error(error);
        }
    };

    return {
        handleDeleteUser,
    };
}