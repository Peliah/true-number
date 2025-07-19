"use server";

import { cookies } from "next/headers";
import { createAuthedServerApi } from "@/actions/api";
import { AxiosError } from "axios";
import { Game } from "@/type/types";

export async function saveGameAction(gameData: Omit<Game, 'userId'>) {
    const accessToken = (await cookies()).get("access_token")?.value;
    const userId = (await cookies()).get("user")?.value;
    console.log(accessToken);

    if (!accessToken) {
        return { error: "Not authenticated" };
    }

    try {
        const authedApi = createAuthedServerApi(accessToken);


        const response = await authedApi.post("/games/play", { ...gameData, userId });

        return { success: true, data: response.data };
    } catch (error) {
        if (error instanceof AxiosError) {
            console.log(error.response?.data);

            return { error: error.response?.data || "Failed to save game history" };
        }
        return { error: "Something went wrong" };
    }
}