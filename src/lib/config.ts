"use server";

import { cookies } from "next/headers";

const getToken = async () => {
    const accessToken = (await cookies()).get("access_token")?.value;
    return accessToken as string;
};

export { getToken };