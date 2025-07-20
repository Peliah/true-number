"use server";

import { cookies } from "next/headers";
import { api } from "./api";
import { AxiosError } from "axios";
import { User } from "@/type/types";

export async function getCurrentUserAction() {
    const accessToken = (await cookies()).get("access_token")?.value;

    if (!accessToken) {
        return { error: "Not authenticated" };
    }

    try {
        const response = await api.get("/users/me", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return { success: true, user: response.data.user };
    } catch (error) {
        if (error instanceof AxiosError) {
            console.log(error.response?.data);
            return { error: error.response?.data || "Failed to get user" };
        }
        return { error: "Failed to get user" };
    }
};

// get all users
export async function getAllUsersAction() {
    const accessToken = (await cookies()).get("access_token")?.value;

    if (!accessToken) {
        return { error: "Not authenticated" };
    }
    try {
        const response = await api.get("/users");
        return { success: true, users: response.data.users };
    } catch (error) {
        if (error instanceof AxiosError) {
            console.log(error.response?.data);
            return { error: error.response?.data || "Failed to get users" };
        }
        return { error: "Failed to get users" };
    }
};

// get user by id
export async function getUserByIdAction(id: string) {
    const accessToken = (await cookies()).get("access_token")?.value;

    if (!accessToken) {
        return { error: "Not authenticated" };
    }
    try {
        const response = await api.get(`/users/${id}`);
        return { success: true, user: response.data.user };
    } catch (error) {
        if (error instanceof AxiosError) {
            console.log(error.response?.data);
            return { error: error.response?.data || "Failed to get user" };
        }
        return { error: "Failed to get user" };
    }
};

// update userby id
export async function updateUserByIdAction(id: string, data: User) {
    const accessToken = (await cookies()).get("access_token")?.value;

    if (!accessToken) {
        return { error: "Not authenticated" };
    }
    try {
        const response = await api.put(`/users/${id}`, data);
        return { success: true, user: response.data.user };
    } catch (error) {
        if (error instanceof AxiosError) {
            console.log(error.response?.data);
            return { error: error.response?.data || "Failed to update user" };
        }
        return { error: "Failed to update user" };
    }
};

// delete user by id
export async function deleteUserByIdAction(id: string) {
    const accessToken = (await cookies()).get("access_token")?.value;

    if (!accessToken) {
        return { error: "Not authenticated" };
    }
    try {
        const response = await api.delete(`/users/${id}`);
        return { success: true, user: response.data.user };
    } catch (error) {
        if (error instanceof AxiosError) {
            console.log(error.response?.data);
            return { error: error.response?.data || "Failed to delete user" };
        }
        return { error: "Failed to delete user" };
    }
};

// create user
export async function createUserAction(data: User) {
    const accessToken = (await cookies()).get("access_token")?.value;

    if (!accessToken) {
        return { error: "Not authenticated" };
    }
    try {
        const response = await api.post("/users", data);
        return { success: true, user: response.data.user };
    } catch (error) {
        if (error instanceof AxiosError) {
            console.log(error.response?.data);
            return { error: error.response?.data || "Failed to create user" };
        }
        return { error: "Failed to create user" };
    }
};