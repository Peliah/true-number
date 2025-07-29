"use server";

import { cookies } from "next/headers";
import { api, createAuthedServerApi } from "./api";
import { AxiosError } from "axios";
import { UserFormValues } from "@/schema/user-schema";

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
            return { error: error.response?.data || "Failed to get user" };
        }
        return { error: "Failed to get user" };
    }
};

// get all users
export async function getAllUsersAction({ limit = 10, offset = 0 } = {}) {
    const accessToken = (await cookies()).get("access_token")?.value;

    if (!accessToken) {
        return { error: "Not authenticated" };
    }

    try {
        const response = await api.get("/users", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params: {
                limit,
                offset,
            },
        });

        return {
            success: true,
            users: response.data.users,
            total: response.data.total,
            limit: response.data.limit,
            offset: response.data.offset,
        };
    } catch (error) {
        if (error instanceof AxiosError) {
            return { error: error.response?.data || "Failed to get users" };
        }

        return { error: "Failed to get users" };
    }
}


// get user by id
export async function getUserByIdAction(id: string) {
    const accessToken = (await cookies()).get("access_token")?.value;

    if (!accessToken) {
        return { error: "Not authenticated" };
    }
    try {
        const response = await createAuthedServerApi(accessToken).get(`/users/${id}`);
        return { success: true, user: response.data };
    } catch (error) {
        if (error instanceof AxiosError) {
            return { error: error.response?.data || "Failed to get user" };
        }
        return { error: "Failed to get user" };
    }
};

// update userby id
export async function updateUserByIdAction(id: string, data: UserFormValues) {
    const accessToken = (await cookies()).get("access_token")?.value;

    if (!accessToken) {
        return { error: "Not authenticated" };
    }
    try {
        const response = await createAuthedServerApi(accessToken).put(`/users/${id}`, data);
        return { success: true, user: response.data.user };
    } catch (error) {
        if (error instanceof AxiosError) {
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
        const response = await createAuthedServerApi(accessToken).delete(`/users/${id}`);
        return { success: true, user: response.data.user };
    } catch (error) {
        if (error instanceof AxiosError) {
            return { error: error.response?.data || "Failed to delete user" };
        }
        return { error: "Failed to delete user" };
    }
};

// create user
export async function createUserAction(data: UserFormValues, password: string) {
    const accessToken = (await cookies()).get("access_token")?.value;

    if (!accessToken) {
        return { error: "Not authenticated" };
    }
    try {
        const response = await createAuthedServerApi(accessToken).post("/users", { ...data, password });
        return { success: true, user: response.data.user };
    } catch (error) {
        if (error instanceof AxiosError) {
            return { error: error.response?.data || "Failed to create user" };
        }
        return { error: "Failed to create user" };
    }
};

// update current user
export async function updateCurrentUserAction(data: UserFormValues) {
    const accessToken = (await cookies()).get("access_token")?.value;

    if (!accessToken) {
        return { error: "Not authenticated" };
    }
    try {
        const response = await createAuthedServerApi(accessToken).put("/users/me", data);
        console.log(response.data);

        return { success: true, user: response.data.user };
    } catch (error) {
        if (error instanceof AxiosError) {
            const apiError = error.response?.data;

            if (apiError?.code === "ValidationError") {
                const fieldErrors: Record<string, string> = {};
                for (const key in apiError.errors) {
                    if (apiError.errors[key]?.msg) {
                        fieldErrors[key] = apiError.errors[key].msg;
                    }
                }
                return { error: "Validation failed", fieldErrors };
            }
            return { error: error.response?.data || "Failed to update user" };
        }
        return { error: "Failed to update user" };
    }
};