'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { User } from '@/type/types';

interface UserTableActionsProps {
    user: User;
    onEdit: (user: User) => void;
    onDelete: (userId: string) => void;
}

export function UserTableActions({ user, onEdit, onDelete }: UserTableActionsProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => { console.log(user); onEdit(user) }}>
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="text-red-500"
                    onClick={() => onDelete(user._id)}
                >
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}