/**
 * Получение данных для экрана "My Screen"
 * Комбинирует крипто-данные от CoinGecko и погоду от Open-Meteo
 */

export const dynamic = "force-dynamic";

import {
	COINS,
	API_URLS,
	COINGECKO_PARAMS,
	DEFAULT_WEATHER_LOCATION,
	FETCH_TIMEOUT_MS,
	getWeatherData,
	fetchWithTimeout,
	getGoogleTasks,
} from "./utils";
import type { CoinGeckoPrice, ScreenData } from "./types";

/**
 * Кэш последних успешных данных (в памяти процесса)
 * Используется для graceful degradation при ошибках API
 */
let lastGoodData: ScreenData | null = null;

export async function getScreenData(accessToken?: string): Promise<ScreenData> {
	const coinIds = COINS.map((c) => c.id).join(",");

	// Построить URL для запроса цен CoinGecko
	const cryptoUrl = new URL(API_URLS.COINGECKO_PRICES);
	cryptoUrl.searchParams.set("ids", coinIds);
	cryptoUrl.searchParams.set("vs_currencies", COINGECKO_PARAMS.vs_currencies);
	cryptoUrl.searchParams.set(
		"include_24hr_change",
		COINGECKO_PARAMS.include_24hr_change,
	);

	try {
		// Параллельно запрашиваем крипто-цены, погоду и задачи
		const [cryptoResponse, weatherData, tasks] = await Promise.all([
			fetchWithTimeout(cryptoUrl.toString(), FETCH_TIMEOUT_MS),
			getWeatherData({
				location: DEFAULT_WEATHER_LOCATION,
			}),
			getGoogleTasks(),
		]);

		// Обработка Rate Limit ошибки
		if (cryptoResponse.status === 429) {
			return (
				lastGoodData ?? {
					updatedAt: `Данные кэшированы (API Rate Limited)`,
					tokens: COINS.map((c) => ({
						...c,
						priceUsd: null,
						change24hPct: null,
					})),
					weather: weatherData,
					tasks,
				}
			);
		}

		// Обработка других HTTP ошибок
		if (!cryptoResponse.ok) {
			return (
				lastGoodData ?? {
					updatedAt: `Данные кэшированы (ошибка ${cryptoResponse.status})`,
					tokens: COINS.map((c) => ({
						...c,
						priceUsd: null,
						change24hPct: null,
					})),
					weather: weatherData,
					tasks,
				}
			);
		}

		const cryptoData = (await cryptoResponse.json()) as Record<
			string,
			CoinGeckoPrice
		>;

		// Комбинируем данные о монетах с полученными ценами
		const data: ScreenData = {
			updatedAt: new Date().toLocaleString("en-US", {
				month: "short",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit",
				hour12: false,
			}),
			tokens: COINS.map((c) => ({
				...c,
				priceUsd:
					typeof cryptoData?.[c.id]?.usd === "number"
						? cryptoData[c.id].usd!
						: null,
				change24hPct:
					typeof cryptoData?.[c.id]?.usd_24h_change === "number"
						? cryptoData[c.id].usd_24h_change!
						: null,
			})),
			weather: weatherData,
			tasks,
		};

		lastGoodData = data;
		return data;
	} catch (error) {
		// Сетевые ошибки, таймауты - graceful fallback
		const weatherData = await getWeatherData({
			location: DEFAULT_WEATHER_LOCATION,
		});
		const tasks = await getGoogleTasks();

		return (
			lastGoodData ?? {
				updatedAt: `Данные кэшированы (сетевая ошибка)`,
				tokens: COINS.map((c) => ({
					...c,
					priceUsd: null,
					change24hPct: null,
				})),
				weather: weatherData,
				tasks,
			}
		);
	}
}

export default async function getData(): Promise<ScreenData> {
	// Получаем токен из переменных окружения или из других источников
	const accessToken = "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";
	return getScreenData(accessToken);
}
