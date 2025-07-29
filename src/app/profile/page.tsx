'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUserStore } from '@/store/user.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Pencil, Save, X, User as UserIcon, Mail, Phone, FileText, Coins, Camera } from 'lucide-react';
import { z } from 'zod';
import { toast } from 'sonner';
import { userFormSchema } from '@/schema/user-schema';
import { updateCurrentUserAction } from '@/actions/user';

export default function ProfilePage() {
    const { user, setUser } = useUserStore();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<z.infer<typeof userFormSchema>>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            username: user?.username || '',
            email: user?.email || '',
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            phone: user?.phone || '',
            bio: user?.bio || '',
            profilePicture: user?.profilePicture || '',
            role: user?.role || 'user',
        },
    });

    const onSubmit = async (data: z.infer<typeof userFormSchema>) => {
        if (!user) return;

        setIsLoading(true);
        try {
            const updatedUser = await updateCurrentUserAction(data);
            setUser(updatedUser.user);
            toast.success('Profile updated successfully');
            setIsEditing(false);
        } catch (error) {
            toast.error('Failed to update profile');
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        reset();
        setIsEditing(false);
    };

    if (!user) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground">Loading profile...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background font-roboto-mono flex items-center justify-center">

            <div className="max-w-6xl mx-auto px-6 relative z-10 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    <div className="lg:col-span-1">
                        <Card className="border-0 shadow-2xl bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/90">
                            <CardContent className="p-8">
                                <div className="text-center">
                                    <div className="relative inline-block mb-6">
                                        <Avatar className="w-32 h-32 border-4 border-background shadow-xl ring-4 ring-primary/10">
                                            <AvatarImage src={user.profilePicture} className="object-cover" />
                                            <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary/20 to-primary/10">
                                                {user.username.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        {isEditing && (
                                            <Button
                                                size="icon"
                                                className="absolute bottom-0 right-0 rounded-full h-10 w-10 shadow-lg"
                                            >
                                                <Camera className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        <div>
                                            <h2 className="text-2xl font-bold text-foreground">
                                                {user.firstName && user.lastName
                                                    ? `${user.firstName} ${user.lastName}`
                                                    : user.username
                                                }
                                            </h2>
                                            <p className="text-muted-foreground font-medium">@{user.username}</p>
                                        </div>

                                        <Badge variant="secondary" className="px-3 py-1 font-medium capitalize">
                                            <UserIcon className="w-3 h-3 mr-1" />
                                            {user.role}
                                        </Badge>
                                    </div>

                                    <Separator className="my-6" />

                                    <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-center mb-2">
                                                <Coins className="w-6 h-6 text-primary mr-2" />
                                                <span className="text-sm font-medium text-muted-foreground">Balance</span>
                                            </div>
                                            <p className="text-3xl font-bold text-primary">
                                                {user.balance.toLocaleString()}
                                            </p>
                                            <p className="text-sm text-muted-foreground mt-1">coins</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-2">
                        <Card className="border-0 shadow-2xl bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/90">
                            <CardHeader className="pb-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <CardTitle className="text-2xl font-bold mb-2">Profile Settings</CardTitle>
                                        <p className="text-muted-foreground">
                                            Manage your account information and preferences
                                        </p>
                                    </div>

                                    {!isEditing ? (
                                        <Button
                                            onClick={() => setIsEditing(true)}
                                            className="shadow-lg hover:shadow-xl transition-all duration-200"
                                        >
                                            <Pencil className="w-4 h-4 mr-2" />
                                            Edit Profile
                                        </Button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                onClick={handleCancel}
                                                className="hover:bg-destructive/10 hover:text-destructive"
                                            >
                                                <X className="w-4 h-4 mr-2" />
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={handleSubmit(onSubmit)}
                                                disabled={isLoading}
                                                className="shadow-lg hover:shadow-xl transition-all duration-200"
                                            >
                                                <Save className="w-4 h-4 mr-2" />
                                                {isLoading ? 'Saving...' : 'Save Changes'}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="flex items-center text-sm font-medium text-foreground">
                                                <UserIcon className="w-4 h-4 mr-2 text-primary" />
                                                Username
                                            </label>
                                            {isEditing ? (
                                                <div className="space-y-2">
                                                    <Input
                                                        {...register('username')}
                                                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                                    />
                                                    {errors.username && (
                                                        <p className="text-sm text-destructive flex items-center">
                                                            {errors.username.message}
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="px-3 py-2 rounded-md bg-muted/50 border border-muted text-foreground font-medium">
                                                    {user.username}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="flex items-center text-sm font-medium text-foreground">
                                                <Mail className="w-4 h-4 mr-2 text-primary" />
                                                Email
                                            </label>
                                            {isEditing ? (
                                                <div className="space-y-2">
                                                    <Input
                                                        {...register('email')}
                                                        type="email"
                                                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                                    />
                                                    {errors.email && (
                                                        <p className="text-sm text-destructive flex items-center">
                                                            {errors.email.message}
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="px-3 py-2 rounded-md bg-muted/50 border border-muted text-foreground">
                                                    {user.email}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">First Name</label>
                                            {isEditing ? (
                                                <Input
                                                    {...register('firstName')}
                                                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                                />
                                            ) : (
                                                <div className="px-3 py-2 rounded-md bg-muted/50 border border-muted text-muted-foreground">
                                                    {user.firstName || 'Not provided'}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">Last Name</label>
                                            {isEditing ? (
                                                <Input
                                                    {...register('lastName')}
                                                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                                />
                                            ) : (
                                                <div className="px-3 py-2 rounded-md bg-muted/50 border border-muted text-muted-foreground">
                                                    {user.lastName || 'Not provided'}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="flex items-center text-sm font-medium text-foreground">
                                            <Phone className="w-4 h-4 mr-2 text-primary" />
                                            Phone
                                        </label>
                                        {isEditing ? (
                                            <div className="space-y-2">
                                                <Input
                                                    {...register('phone')}
                                                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                                />
                                                {errors.phone && (
                                                    <p className="text-sm text-destructive flex items-center">
                                                        {errors.phone.message}
                                                    </p>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="px-3 py-2 rounded-md bg-muted/50 border border-muted text-foreground">
                                                {user.phone}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="flex items-center text-sm font-medium text-foreground">
                                            <FileText className="w-4 h-4 mr-2 text-primary" />
                                            Bio
                                        </label>
                                        {isEditing ? (
                                            <Textarea
                                                {...register('bio')}
                                                rows={4}
                                                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 resize-none"
                                                placeholder="Tell us about yourself..."
                                            />
                                        ) : (
                                            <div className="px-3 py-3 rounded-md bg-muted/50 border border-muted text-muted-foreground min-h-[100px]">
                                                {user.bio || 'No bio provided yet'}
                                            </div>
                                        )}
                                    </div>

                                    {isEditing && (
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">
                                                Profile Picture URL
                                            </label>
                                            <Input
                                                {...register('profilePicture')}
                                                placeholder="https://example.com/image.jpg"
                                                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                            />
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}