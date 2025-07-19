"use server";

import { cookies } from "next/headers";
import { api } from "./api";
import { AxiosError } from "axios";

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

        return { success: true, user: response.data };
    } catch (error) {
        if (error instanceof AxiosError) {
            console.log(error.response?.data);
            return { error: error.response?.data || "Failed to get user" };
        }
        return { error: "Failed to get user" };
    }
};