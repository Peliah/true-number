import z from "zod";

export const userFormSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.email('Invalid email address'),
    role: z.enum(['user', 'admin']),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().min(9, 'Phone must be at least 9 digits').max(9, 'Phone must be at most 9 digits'),
    bio: z.string().optional(),
    profilePicture: z.string().optional(),
    balance: z.number().default(0).optional(),

});
export type UserFormValues = z.infer<typeof userFormSchema>;
