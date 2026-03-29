/**
 * Утилиты для работы с API погоды Open-Meteo
 * Включает форматирование кодов погоды, геокодирование, запрос погодных данных
 */

import {
	API_URLS,
	FETCH_TIMEOUT_MS,
	DEFAULT_LATITUDE,
	DEFAULT_LONGITUDE,
	DEFAULT_LOCATION_NAME,
	OPENMETEO_WEATHER_PARAMS,
} from "./constants";
import type { GeocodingResponse, WeatherData, WeatherParams } from "../types";
import { formatNow, formatTime } from "./formatters";

/**
 * Маппинг кодов погоды WMO на русское описание
 * https://www.weatherapi.com/docs/weather_codes.asp
 */
const WEATHER_CODE_MAP: Record<number, string> = {
	0: "Ясное небо",
	1: "Преимущественно ясно",
	2: "Частичная облачность",
	3: "Облачно",
	45: "Туман",
	48: "Изморозь",
	51: "Слабая морось",
	53: "Умеренная морось",
	55: "Сильная морось",
	56: "Слабая ледяная морось",
	57: "Сильная ледяная морось",
	61: "Слабый дождь",
	63: "Умеренный дождь",
	65: "Сильный дождь",
	66: "Слабый ледяной дождь",
	67: "Сильный ледяной дождь",
	71: "Слабый снегопад",
	73: "Умеренный снегопад",
	75: "Сильный снегопад",
	77: "Снежная крупа",
	80: "Слабые ливни",
	81: "Умеренные ливни",
	82: "Сильные ливни",
	85: "Слабые снежные ливни",
	86: "Сильные снежные ливни",
	95: "Гроза",
	96: "Гроза со слабым градом",
	99: "Гроза с сильным градом",
};

/**
 * Получить русское описание погоды по WMO коду
 * @param code - WMO код погоды
 * @returns русское описание или "Неизвестно"
 */
export function getWeatherDescription(code: number): string {
	return WEATHER_CODE_MAP[code] ?? "Неизвестно";
}

/**
 * Преобразовать координаты в геолокацию через Open-Meteo Geocoding API
 * @param locationName - название места для поиска
 * @returns объект с координатами и названием или null
 */
export async function geocodeLocation(
	locationName: string,
): Promise<{ latitude: number; longitude: number; name: string } | null> {
	try {
		const url = new URL(API_URLS.OPENMETEO_GEOCODING);
		url.searchParams.set("name", locationName);
		url.searchParams.set("count", "1");
		url.searchParams.set("language", "en");
		url.searchParams.set("format", "json");

		const response = await fetch(url.toString(), {
			headers: {
				Accept: "application/json",
			},
			cache: "no-store",
		});

		if (!response.ok) {
			return null;
		}

		const data: GeocodingResponse = await response.json();

		if (data.results && data.results.length > 0) {
			const result = data.results[0];
			return {
				latitude: result.latitude,
				longitude: result.longitude,
				name: `${result.name}, ${result.country}`,
			};
		}

		return null;
	} catch {
		return null;
	}
}

/**
 * Fetch с таймаутом
 * @param url - URL для запроса
 * @param ms - таймаут в миллисекундах (по умолчанию FETCH_TIMEOUT_MS)
 * @returns Response объект
 */
export async function fetchWithTimeout(
	url: string,
	ms = FETCH_TIMEOUT_MS,
): Promise<Response> {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), ms);

	try {
		return await fetch(url, {
			headers: {
				Accept: "application/json",
				"Accept-Language": "en-US",
			},
			cache: "no-store",
			signal: controller.signal,
		});
	} finally {
		clearTimeout(timeoutId);
	}
}

/**
 * Построить URL для API запроса Open-Meteo
 * @param latitude - широта
 * @param longitude - долгота
 * @returns URL для запроса
 */
function buildWeatherUrl(latitude: number, longitude: number): string {
	const url = new URL(API_URLS.OPENMETEO_FORECAST);
	url.searchParams.set("latitude", latitude.toString());
	url.searchParams.set("longitude", longitude.toString());
	url.searchParams.set("current", OPENMETEO_WEATHER_PARAMS.current);
	url.searchParams.set("daily", OPENMETEO_WEATHER_PARAMS.daily);
	url.searchParams.set("timezone", OPENMETEO_WEATHER_PARAMS.timezone);
	return url.toString();
}

/**
 * Получить данные о погоде
 * @param params - параметры для поиска (место, координаты)
 * @returns объект с данными о погоде или дефолтные значения
 */
export async function getWeatherData(
	params?: WeatherParams,
): Promise<WeatherData> {
	try {
		let latitude = params?.latitude ?? DEFAULT_LATITUDE;
		let longitude = params?.longitude ?? DEFAULT_LONGITUDE;
		let locationName = params?.location ?? DEFAULT_LOCATION_NAME;

		// Если передано название места, пробуем геокодировать
		if (params?.location && !params?.latitude && !params?.longitude) {
			const geocoded = await geocodeLocation(params.location);
			if (geocoded) {
				latitude = geocoded.latitude;
				longitude = geocoded.longitude;
				locationName = geocoded.name;
			}
		}

		const response = await fetchWithTimeout(
			buildWeatherUrl(latitude, longitude),
		);

		if (!response.ok) {
			return getDefaultWeatherData(locationName, latitude, longitude);
		}

		const data = await response.json();
		const current = data.current;
		const daily = data.daily;

		if (!current) {
			return getDefaultWeatherData(locationName, latitude, longitude);
		}

		return {
			temperature: Math.round(current.temperature_2m).toString(),
			feelsLike: Math.round(current.apparent_temperature).toString(),
			humidity: Math.round(current.relative_humidity_2m).toString(),
			windSpeed: Math.round(current.wind_speed_10m).toString(),
			description: getWeatherDescription(current.weather_code),
			location: locationName,
			pressure: Math.round(current.surface_pressure).toString(),
			lastUpdated: formatNow(),
			highTemp: Math.round(daily.temperature_2m_max[0]).toString(),
			lowTemp: Math.round(daily.temperature_2m_min[0]).toString(),
			sunset: formatTime(daily.sunset[0]),
			sunrise: formatTime(daily.sunrise[0]),
			latitude,
			longitude,
		};
	} catch {
		return getDefaultWeatherData();
	}
}

/**
 * Получить дефолтные значения погоды при ошибке
 * @param location - название места
 * @param latitude - широта
 * @param longitude - долгота
 * @returns объект с дефолтными значениями "N/A"
 */
function getDefaultWeatherData(
	location = DEFAULT_LOCATION_NAME,
	latitude = DEFAULT_LATITUDE,
	longitude = DEFAULT_LONGITUDE,
): WeatherData {
	return {
		temperature: "N/A",
		feelsLike: "N/A",
		humidity: "N/A",
		windSpeed: "N/A",
		description: "N/A",
		location,
		pressure: "N/A",
		lastUpdated: "N/A",
		highTemp: "N/A",
		lowTemp: "N/A",
		sunset: "N/A",
		sunrise: "N/A",
		latitude,
		longitude,
	};
}
