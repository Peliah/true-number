"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { loginSchema, LoginFormData } from "@/schema/auth-schema";
import { serverApi, createAuthedServerApi } from "@/actions/api";
import { AxiosError } from "axios";
import { RegisterCredentials } from "@/type/auth";

export async function loginAction(data: LoginFormData) {
  const validatedFields = loginSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  try {
    const response = await serverApi.post("/auth/login", validatedFields.data);
    const result = response.data;


    // Set cookies
    (await cookies()).set("access_token", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Store user data in cookie as well (optional)
    (await cookies()).set("user", result.user.userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return { success: true, user: result.user };
  } catch (error) {
    if (error instanceof AxiosError) {
      return { error: error.response?.data?.message || "Login failed" };
    }
    return { error: "Something went wrong" };
  }
}

export async function logoutAction() {
  try {
    const accessToken = (await cookies()).get("access_token")?.value;

    if (accessToken) {
      const authedApi = createAuthedServerApi(accessToken);
      await authedApi.post("/auth/logout");
    }
  } catch (error) {
    // Continue with logout even if API call fails
    console.error("Error logging out:", error);
  }

  // Clear cookies
  (await cookies()).delete("access_token");
  (await cookies()).delete("user");

  redirect("/");
}

export async function refreshTokenAction() {
  try {
    const refreshToken = (await cookies()).get("refresh_token")?.value;

    if (!refreshToken) {
      return { error: "No refresh token available" };
    }

    // Call refresh endpoint with refresh token (not access token)
    const response = await serverApi.post("/auth/refresh-token", {
      refreshToken: refreshToken
    });

    const result = response.data;

    // Update cookies with new tokens
    (await cookies()).set("access_token", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 15, // 15 minutes for access token
    });

    if (result.refreshToken) {
      (await cookies()).set("refresh_token", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days for refresh token
      });
    }

    return { success: true, accessToken: result.accessToken };
  } catch (error) {
    // Clear all cookies on refresh failure
    console.error("Token refresh error:", error);
    (await cookies()).delete("access_token");
    (await cookies()).delete("refresh_token");
    (await cookies()).delete("user");

    return { error: "Token refresh failed" };
  }
}

export async function registerAction(data: RegisterCredentials) {
  try {
    const response = await serverApi.post("/auth/register", data);
    const result = response.data;
    console.log(result);


    // Set cookies
    (await cookies()).set("access_token", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Store user data in cookie as well (optional)
    (await cookies()).set("user", result.user.userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return { success: true, data: response.data };
  } catch (error) {

    if (error instanceof AxiosError) {
      console.log(error.response?.data);
      return { error: error.response?.data || "Registration failed" };
    }
    return { error: "Registration failed" };
  }
}