/**
 * Константы и конфигурация для экрана "My Screen"
 */

import type { TokenRow } from "../types";

/**
 * Список поддерживаемых крипто-валют с основной информацией
 */
export const COINS: Array<
	Pick<TokenRow, "id" | "symbol" | "name" | "logoUrl">
> = [
	{
		id: "bitcoin",
		symbol: "BTC",
		name: "Bitcoin",
		logoUrl: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
	},
	{
		id: "solana",
		symbol: "SOL",
		name: "Solana",
		logoUrl: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
	},
	{
		id: "meteora",
		symbol: "MET",
		name: "Meteora",
		logoUrl: "https://assets.coingecko.com/coins/images/???/large/meteora.png",
	},
];

/**
 * Таймаут для API запросов (в миллисекундах)
 */
export const FETCH_TIMEOUT_MS = 4000;

/**
 * Дефолтная локация для погоды
 */
export const DEFAULT_WEATHER_LOCATION = "Raanana, Israel";

/**
 * Дефолтные координаты (резервные значения)
 */
export const DEFAULT_LATITUDE = 37.7749;
export const DEFAULT_LONGITUDE = -122.4194;
export const DEFAULT_LOCATION_NAME = "San Francisco";

/**
 * API URLs
 */
export const API_URLS = {
	COINGECKO_PRICES: "https://api.coingecko.com/api/v3/simple/price",
	OPENMETEO_FORECAST: "https://api.open-meteo.com/v1/forecast",
	OPENMETEO_GEOCODING: "https://geocoding-api.open-meteo.com/v1/search",
} as const;

/**
 * Параметры для CoinGecko запроса
 */
export const COINGECKO_PARAMS = {
	vs_currencies: "usd",
	include_24hr_change: "true",
} as const;

/**
 * Параметры для Open-Meteo погоды запроса
 */
export const OPENMETEO_WEATHER_PARAMS = {
	current:
		"temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,surface_pressure,weather_code",
	daily: "temperature_2m_max,temperature_2m_min,sunset,sunrise",
	timezone: "auto",
} as const;
