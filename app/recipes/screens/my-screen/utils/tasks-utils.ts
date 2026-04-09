/**
 * Утилиты для работы с Google Tasks API
 */

import type { GoogleTask } from "../types";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

async function getAccessToken(): Promise<string> {
	const res = await fetch(GOOGLE_TOKEN_URL, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			client_id: process.env.GOOGLE_CLIENT_ID!,
			client_secret: process.env.GOOGLE_CLIENT_SECRET!,
			refresh_token: process.env.GOOGLE_REFRESH_TOKEN!,
			grant_type: "refresh_token",
		}),
	});

	const data = await res.json();
	if (!data.access_token)
		throw new Error("Failed to refresh token: " + JSON.stringify(data));
	return data.access_token;
}

const BASE = "https://tasks.googleapis.com/tasks/v1";

async function getTaskLists(accessToken: string) {
	const res = await fetch(`${BASE}/users/@me/lists`, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});

	if (!res.ok) throw new Error(`Error: ${res.status} ${await res.text()}`);

	const data = await res.json();
	return data.items as Array<{ id: string; title: string }>;
}

// (async () => {
//   try {
//     const token = await getAccessToken();
//     const lists = await getTaskLists(token);
//     console.log(lists);
//   } catch (error) {
//     console.error(error);
//   }
// })();

/**
 * Получить список задач из Google Tasks API
 * @param accessToken - токен доступа Google
 * @returns массив задач или пустой массив при ошибке
 */
export async function getGoogleTasks(options?: {
	showCompleted?: boolean;
	showHidden?: boolean;
	maxResults?: number;
}): Promise<GoogleTask[]> {
	const params = new URLSearchParams({
		showCompleted: String(true),
		showHidden: String(options?.showHidden ?? false),
		maxResults: String(options?.maxResults ?? 100),
	});

	try {
		const token = await getAccessToken();
		if (!token) return [];

		// Получаем список задач с указанными параметрами
		const response = await fetch(
			`https://tasks.googleapis.com/tasks/v1/lists/MXI3dzV3UTRfOUVyVFBuUA/tasks?${params}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: "application/json",
				},
				cache: "no-store",
			},
		);

		if (!response.ok) {
			console.error("Failed to fetch task lists:", response.statusText);
			return [];
		}

		const listsData = await response.json();
		const lists = listsData.items || [];

		console.log("Fetched Google Tasks:", lists);

		return lists;
	} catch (error) {
		console.error("Error fetching Google Tasks:", error);
		return [];
	}
}
