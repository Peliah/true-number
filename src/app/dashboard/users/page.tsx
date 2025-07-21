'use client';

import { useState, useEffect } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useDashboardStore } from '@/store/dashboard.store';
import { User } from '@/type/types';
import { UserFormDialog } from '@/components/users/user-form-dialog';
import { UserTable } from '@/components/users/user-table';
import { LoadingSpinner } from '@/components/users/loading-spinner';
import { UsersPageHeader } from '@/components/users/user-page-header';
import { useUserManagement } from '@/hooks/use-user-management';

export default function UsersPage() {
    const {
        users,
        usersLoading,
        usersError,
        fetchUsers,
        resetErrors,
    } = useDashboardStore();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const { handleDeleteUser } = useUserManagement();

    // Fetch users on mount
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Handle errors
    useEffect(() => {
        if (usersError) {
            toast.error(usersError);
            resetErrors();
        }
    }, [usersError, resetErrors]);

    const handleAddUser = () => {
        setCurrentUser(null);
        setIsDialogOpen(true);
    };

    const handleEditUser = (user: User) => {
        setCurrentUser(user);
        setIsDialogOpen(true);
    };

    return (
        <div className="p-6">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <UsersPageHeader onAddUser={handleAddUser} />
                <UserFormDialog
                    isOpen={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    currentUser={currentUser}
                />
            </Dialog>

            {usersLoading ? (
                <LoadingSpinner />
            ) : (
                <UserTable
                    users={users}
                    onEditUser={handleEditUser}
                    onDeleteUser={handleDeleteUser}
                />
            )}
        </div>
    );
}