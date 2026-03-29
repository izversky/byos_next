/\*\*

- Примеры импортов для разных частей структуры
- Это справочный файл для быстрого поиска нужных импортов
  \*/

// ============================================
// 📌 КОМПОНЕНТЫ (из ./components)
// ============================================

// ✅ Удобный импорт (через index.ts):
import { WeatherIcon, CryptoItem } from "./components";

// ❌ Прямой импорт (не рекомендуется):
// import { WeatherIcon } from "./components/weather-icon";
// import { CryptoItem } from "./components/crypto-item";

// ============================================
// 📌 УТИЛИТЫ И ФУНКЦИИ (из ./utils)
// ============================================

// ✅ Удобный импорт (через index.ts):
import {
// Константы
COINS,
API_URLS,
DEFAULT_WEATHER_LOCATION,
// Форматирование
formatPrice,
formatPct,
formatDateRu,
toNum,
// Погода
getWeatherData,
fetchWithTimeout,
} from "./utils";

// ❌ Прямые импорты (не рекомендуется):
// import { formatPrice } from "./utils/formatters";
// import { getWeatherData } from "./utils/weather-utils";
// import { COINS } from "./utils/constants";

// ============================================
// 📌 ТИПЫ (из ./types.ts)
// ============================================

// ✅ Рекомендуемый импорт:
import type {
ScreenProps,
TokenRow,
WeatherData,
ScreenData,
} from "./types";

// ============================================
// 📌 ИКОНКИ (из ./icons.tsx)
// ============================================

// ✅ Импорт иконок:
import {
BitcoinIcon,
SolIcon,
MeteoraIcon,
// Погода
CloudIcon,
FogIcon,
RainIcon,
SnowIcon,
SunIcon,
ThunderIcon,
// Температура
TempUp,
TempDown,
// Погода доп
HumidityIcon,
WindIcon,
SunsetIcon,
SunriseIcon,
} from "./icons";

// ============================================
// 📌 ОСНОВНОЙ КОМПОНЕНТ
// ============================================

// ✅ Импорт основного компонента:
import Screen from "./my-screen";

// ============================================
// 📌 ПОЛУЧЕНИЕ ДАННЫХ (Server Action)
// ============================================

// ✅ Импорт функции загрузки данных:
import getData from "./getData";

// ============================================
// 📝 ПРАВИЛА ИМПОРТОВ
// ============================================

/\*\*

- 1.  Используйте index.ts файлы для компонентов и утилит
- 2.  Типы импортируются с `import type { ... }`
- 3.  Обычные импорты для функций, константы и компонентов
-
- ✅ Хорошо:
- import { Component } from "./components";
- import type { Props } from "./types";
- import { formatPrice, COINS } from "./utils";
-
- ❌ Плохо:
- import { Component } from "./components/component.tsx";
- import { formatPrice } from "./utils/formatters";
- import Props from "./types"; // не используйте default
  \*/
