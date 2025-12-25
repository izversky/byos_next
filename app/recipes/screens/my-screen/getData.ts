export const dynamic = "force-dynamic";

type CoinId = "bitcoin" | "solana" | "meteora";

type TokenRow = {
  id: CoinId;
  symbol: string;
  name: string;
  priceUsd: number | null;
  change24hPct: number | null;
  logoUrl: string;
};

interface WeatherData {
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

export type CryptoMultiData = {
  updatedAt: string;
  tokens: TokenRow[];
  weather: WeatherData;
};

interface GeocodingResponse {
  results: Array<{
    name: string;
    country: string;
    latitude: number;
    longitude: number;
  }>;
}

type WeatherParams = {
  location?: string;
  latitude?: number;
  longitude?: number;
};

// IMPORTANT:
// 1) один запрос на все монеты
// 2) мягкие фоллбеки (никаких throw наружу)
// 3) таймаут чтобы UI не зависал
// 4) получить погоду из Open-Meteo API

const COINS: Array<Pick<TokenRow, "id" | "symbol" | "name" | "logoUrl">> = [
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

// Мини-кэш в памяти процесса
let lastGood: CryptoMultiData | null = null;

function formatNow(): string {
  return new Date().toLocaleString("ru-RU", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatTime(timeString: string): string {
  const date = new Date(timeString);
  return date.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

async function geocodeLocation(
  locationName: string
): Promise<{ latitude: number; longitude: number; name: string } | null> {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        locationName
      )}&count=1&language=en&format=json`,
      {
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      }
    );

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

async function fetchWithTimeout(url: string, ms = 4000): Promise<Response> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, {
      headers: { Accept: "application/json", "Accept-Language": "en-US" },
      cache: "no-store",
      signal: controller.signal,
    });
  } finally {
    clearTimeout(t);
  }
}

function getWeatherDescription(code: number): string {
  const weatherCodes: { [key: number]: string } = {
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
  return weatherCodes[code] || "Неизвестно";
}

async function getWeatherData(params?: WeatherParams): Promise<WeatherData> {
  try {
    let latitude = params?.latitude || 37.7749;
    let longitude = params?.longitude || -122.4194;
    let locationName = params?.location || "San Francisco";

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
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,surface_pressure,weather_code&daily=temperature_2m_max,temperature_2m_min,sunset,sunrise&timezone=auto`,
      4000
    );

    if (!response.ok) {
      return {
        temperature: "N/A",
        feelsLike: "N/A",
        humidity: "N/A",
        windSpeed: "N/A",
        description: "N/A",
        location: locationName,
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

    const data = await response.json();
    const current = data.current;
    const daily = data.daily;

    if (!current) {
      return {
        temperature: "N/A",
        feelsLike: "N/A",
        humidity: "N/A",
        windSpeed: "N/A",
        description: "N/A",
        location: locationName,
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
    return {
      temperature: "N/A",
      feelsLike: "N/A",
      humidity: "N/A",
      windSpeed: "N/A",
      description: "N/A",
      location: "San Francisco",
      pressure: "N/A",
      lastUpdated: "N/A",
      highTemp: "N/A",
      lowTemp: "N/A",
      sunset: "N/A",
      sunrise: "N/A",
      latitude: 37.7749,
      longitude: -122.4194,
    };
  }
}

export default async function getData(): Promise<CryptoMultiData> {
  const ids = COINS.map((c) => c.id).join(",");

  // один запрос на цены + 24h change
  const cryptoUrl =
    `https://api.coingecko.com/api/v3/simple/price` +
    `?ids=${encodeURIComponent(ids)}` +
    `&vs_currencies=usd` +
    `&include_24hr_change=true`;

  try {
    // Параллельно получаем крипто и погоду
    const [cryptoRes, weatherData] = await Promise.all([
      fetchWithTimeout(cryptoUrl, 4000),
      getWeatherData({
        location: "Raanana, Israel",
      }),
    ]);

    if (cryptoRes.status === 429) {
      // rate limit: возвращаем последнее хорошее
      return (
        lastGood ?? {
          updatedAt: `${formatNow()} (rate-limited)`,
          tokens: COINS.map((c) => ({
            ...c,
            priceUsd: null,
            change24hPct: null,
          })),
          weather: weatherData,
        }
      );
    }

    if (!cryptoRes.ok) {
      return (
        lastGood ?? {
          updatedAt: `${formatNow()} (error ${cryptoRes.status})`,
          tokens: COINS.map((c) => ({
            ...c,
            priceUsd: null,
            change24hPct: null,
          })),
          weather: weatherData,
        }
      );
    }

    const json = (await cryptoRes.json()) as Record<
      string,
      { usd?: number; usd_24h_change?: number }
    >;

    const data: CryptoMultiData = {
      updatedAt: formatNow(),
      tokens: COINS.map((c) => ({
        ...c,
        priceUsd:
          typeof json?.[c.id]?.usd === "number" ? json[c.id].usd! : null,
        change24hPct:
          typeof json?.[c.id]?.usd_24h_change === "number"
            ? json[c.id].usd_24h_change!
            : null,
      })),
      weather: weatherData,
    };

    lastGood = data;
    return data;
  } catch {
    // timeout / network error — тоже без падения
    const weatherData = await getWeatherData({
      location: "Raanana, Israel",
    });
    return (
      lastGood ?? {
        updatedAt: `${formatNow()} (network error)`,
        tokens: COINS.map((c) => ({
          ...c,
          priceUsd: null,
          change24hPct: null,
        })),
        weather: weatherData,
      }
    );
  }
}
