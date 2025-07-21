'use client';

import { Button } from '@/components/ui/button';
import { DialogTrigger } from '@/components/ui/dialog';

interface UsersPageHeaderProps {
    onAddUser: () => void;
}

export function UsersPageHeader({ onAddUser }: UsersPageHeaderProps) {
    return (
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Users Management</h1>
            <DialogTrigger asChild>
                <Button onClick={onAddUser}>
                    Add User
                </Button>
            </DialogTrigger>
        </div>
    );
}