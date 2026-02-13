// API Service configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function fetcher(url: string) {
    const res = await fetch(`${API_BASE_URL}${url}`);
    if (!res.ok) throw new Error("Failed to fetch data");
    return res.json();
}
