/**
 * Типы данных для экрана "My Screen"
 * Содержит все интерфейсы и типы для работы с крипто и погодой
 */

/**
 * ID поддерживаемых криптовалют
 */
export type CoinId = "bitcoin" | "solana" | "meteora";

/**
 * Информация о токене/монете
 */
export interface TokenRow {
  id: CoinId;
  symbol: string;
  name: string;
  priceUsd: number | null;
  change24hPct: number | null;
  logoUrl: string;
}

/**
 * Данные о погоде от Open-Meteo API
 */
export interface WeatherData {
  temperature: string;
  feelsLike: string;
  humidity: string;
  windSpeed: string;
  description: string;
  location: string;
  pressure: string;
  lastUpdated: string;
  highTemp: string;
  lowTemp: string;
  sunset: string;
  sunrise: string;
  latitude: number;
  longitude: number;
}

/**
 * Задача из Google Tasks
 */
export interface GoogleTask {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

/**
 * Комбинированные данные для отображения на экране
 */
export interface ScreenData {
  updatedAt: string;
  tokens: TokenRow[];
  weather: WeatherData;
  tasks?: GoogleTask[];
}

/**
 * Props компонента Screen
 */
export interface ScreenProps extends ScreenData {
  width?: number;
  height?: number;
}

/**
 * Параметры для запроса геолокации
 */
export interface WeatherParams {
  location?: string;
  latitude?: number;
  longitude?: number;
}

/**
 * Результат геокодирования от Open-Meteo
 */
export interface GeocodingResult {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

/**
 * Ответ от API геокодирования
 */
export interface GeocodingResponse {
  results: GeocodingResult[];
}

/**
 * Структура ответа от CoinGecko API
 */
export interface CoinGeckoPrice {
  usd?: number;
  usd_24h_change?: number;
}
