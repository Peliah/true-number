"use server";

import { cookies } from "next/headers";
import { createAuthedServerApi, createAuthedServerApiV2 } from "@/actions/api";
import { AxiosError } from "axios";
import { Game, GameRoom } from "@/type/types";

export async function saveGameAction(gameData: Game) {
    const accessToken = (await cookies()).get("access_token")?.value;

    if (!accessToken) {
        return { error: "Not authenticated" };
    }

    try {
        const authedApi = createAuthedServerApi(accessToken);


        const response = await authedApi.post("/games/play", gameData);

        return { success: true, data: response.data };
    } catch (error) {
        if (error instanceof AxiosError) {
            console.log(error.response?.data);

            return { error: error.response?.data || "Failed to save game history" };
        }
        return { error: "Something went wrong" };
    }
}

export async function getAllGamesAction() {
    const accessToken = (await cookies()).get("access_token")?.value;

    if (!accessToken) {
        return { error: "Not authenticated" };
    }

    try {
        const response = await createAuthedServerApiV2(accessToken).get("/games");
        console.log(response.data);

        return { success: true, games: response.data };
    } catch (error) {
        if (error instanceof AxiosError) {
            console.log(error.response?.data);
            return { error: error.response?.data || "Failed to get games" };
        }
        return { error: "Failed to get games" };
    }
}

export async function createGameAction(gameData: GameRoom) {
    const accessToken = (await cookies()).get("access_token")?.value;

    if (!accessToken) {
        return { error: "Not authenticated" };
    }

    try {
        const response = await createAuthedServerApiV2(accessToken).post("/games", gameData);
        return { success: true, data: response.data };
    } catch (error) {
        if (error instanceof AxiosError) {
            console.log(error.response?.data);
            return { error: error.response?.data || "Failed to create game" };
        }
        return { error: "Failed to create game" };
    }
}

export async function joinGameAction(gameId: string) {
    const accessToken = (await cookies()).get("access_token")?.value;

    if (!accessToken) {
        return { error: "Not authenticated" };
    }

    try {
        const response = await createAuthedServerApiV2(accessToken).post(`/games/${gameId}/join`);
        return { success: true, data: response.data };
    } catch (error) {
        if (error instanceof AxiosError) {
            console.log(error.response?.data);
            return { error: error.response?.data || "Failed to join game" };
        }
        return { error: "Failed to join game" };
    }
}