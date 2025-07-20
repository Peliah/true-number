"use server";

import { cookies } from "next/headers";
import { api } from "./api";
import { AxiosError } from "axios";

export async function getHistoryAction() {
    const accessToken = (await cookies()).get("access_token")?.value;

    if (!accessToken) {
        return { error: "Not authenticated" };
    }

    try {
        const response = await api.get("/history", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return { success: true, history: response.data.history };
    } catch (error) {
        if (error instanceof AxiosError) {
            console.log(error.response?.data);
            return { error: error.response?.data || "Failed to get history" };
        }
        return { error: "Failed to get history" };
    }
};