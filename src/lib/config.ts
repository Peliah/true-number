// lib/config.ts
interface AppConfig {
    api: {
        baseUrl: string;
        timeout: number;
    };
}

export const config: AppConfig = {
    api: {
        baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '',
        timeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 5000,
    },
};

// Validate required environment variables
if (!config.api.baseUrl) {
    throw new Error('Missing NEXT_PUBLIC_API_BASE_URL environment variable');
}