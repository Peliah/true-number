'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { User } from '@/type/types';
import { userFormSchema, UserFormValues } from '@/schema/user-schema';
import { useDashboardStore } from '@/store/dashboard.store';
import { Textarea } from '../ui/textarea';
import { createUserAction, updateUserByIdAction } from '@/actions/user';

interface UserFormDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    currentUser: User | null;
}
export function UserFormDialog({ isOpen, onOpenChange, currentUser }: UserFormDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { fetchDashboardData } = useDashboardStore();

    const form = useForm<UserFormValues>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            username: currentUser?.username || '',
            email: currentUser?.email || '',
            role: currentUser?.role || 'user',
            firstName: currentUser?.firstName || '',
            lastName: currentUser?.lastName || '',
            phone: currentUser?.phone || '',
            bio: currentUser?.bio || '',
            profilePicture: currentUser?.profilePicture || '',
            balance: currentUser?.balance || 0,
        },
    });

    useEffect(() => {
        form.reset({
            username: currentUser?.username || '',
            email: currentUser?.email || '',
            role: currentUser?.role || 'user',
            firstName: currentUser?.firstName || '',
            lastName: currentUser?.lastName || '',
            phone: currentUser?.phone || '',
            bio: currentUser?.bio || '',
            profilePicture: currentUser?.profilePicture || '',
            balance: currentUser?.balance || 0,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser]);


    const onSubmit = async (data: UserFormValues) => {
        setIsSubmitting(true);
        const password = Math.random().toString(36).slice(-8);

        try {
            let result;
            if (currentUser) {
                // Update existing user
                result = await updateUserByIdAction(currentUser._id, data);
            }
            else {
                // Create new user
                // generate password
                result = await createUserAction(data, password);
                if (result.error) {
                    toast.error(result.error.message);
                    return;
                }
                toast.success('User created successfully', {
                    description: `Password: ${password}`,
                    duration: 10000,
                    position: 'bottom-center',
                });
            }

            if (result!.error) {
                toast.error(result!.error.message);
            } else {
                toast.success(`User ${currentUser ? 'updated' : 'created'} successfully`);
                fetchDashboardData();
                onOpenChange(false);
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>
                        {currentUser ? 'Edit User' : 'Create New User'}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                {...form.register('username')}
                                placeholder="johndoe"
                            />
                            {form.formState.errors.username && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.username.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                {...form.register('email')}
                                placeholder="user@example.com"
                            />
                            {form.formState.errors.email && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.email.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                {...form.register('firstName')}
                                placeholder="John"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                {...form.register('lastName')}
                                placeholder="Doe"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                {...form.register('phone')}
                                placeholder="1234567890"
                            />
                            {form.formState.errors.phone && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.phone.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select
                                onValueChange={(value) => form.setValue('role', value as 'user' | 'admin')}
                                defaultValue={form.watch('role')}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea id="bio" {...form.register('bio')} placeholder="About the user" rows={3} />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save User'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}