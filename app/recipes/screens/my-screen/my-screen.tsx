import { PreSatori } from "@/utils/pre-satori";
import type { CryptoMultiData } from "./getData";
import { BitcoinIcon, MeteoraIcon, SolIcon } from "./icons";
import {
  CloudIcon,
  FogIcon,
  HumidityIcon,
  RainIcon,
  SnowIcon,
  SunIcon,
  WindIcon,
  ThunderIcon,
  SunsetIcon,
  SunriseIcon,
  TempUp,
  TempDown,
} from "./icons";

interface Props extends CryptoMultiData {
  width?: number;
  height?: number;
}

function toNum(v: unknown): number | null {
  if (v == null) return null;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

function formatPrice(v: number | null) {
  if (v == null) return "N/A";
  return v.toLocaleString("en-US", {
    maximumFractionDigits: 2,
  });
}

function formatPct(v: number | null) {
  if (v == null) return "N/A";
  return Math.abs(v).toFixed(2);
}

function formatDateRu(date: Date): string {
  const daysOfWeek = ["ВС", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"];
  const dayOfWeek = daysOfWeek[date.getDay()];
  const dayOfMonth = date.getDate();
  return `${dayOfWeek}, ${dayOfMonth}`;
}

interface WeatherIconProps extends React.SVGProps<SVGSVGElement> {
  description: string;
}

function WeatherIcon({ description, ...props }: WeatherIconProps) {
  const lowerDesc = description.toLowerCase();
  if (
    lowerDesc.includes("дождь") ||
    lowerDesc.includes("морось") ||
    lowerDesc.includes("ливни")
  )
    return <RainIcon {...props} />;
  if (
    lowerDesc.includes("снегопад") ||
    lowerDesc.includes("снежные") ||
    lowerDesc.includes("снег")
  )
    return <SnowIcon {...props} />;
  if (
    lowerDesc.includes("облачность") ||
    lowerDesc.includes("облачно") ||
    lowerDesc.includes("облако")
  )
    return <CloudIcon {...props} />;
  if (
    lowerDesc.includes("ясное") ||
    lowerDesc.includes("ясно") ||
    lowerDesc.includes("ясн") ||
    lowerDesc.includes("солнечно")
  )
    return <SunIcon {...props} />;
  if (
    lowerDesc.includes("туман") ||
    lowerDesc.includes("изморозь") ||
    lowerDesc.includes("мгла")
  )
    return <FogIcon {...props} />;
  if (lowerDesc.includes("гроза")) return <ThunderIcon {...props} />;
}

export default function Screen({
  tokens,
  updatedAt,
  weather,
  width = 800,
  height = 480,
}: Props) {
  const safeTokens = Array.isArray(tokens) ? tokens : [];

  return (
    <PreSatori useDoubling width={width} height={height}>
      <div className="flex h-full w-full flex-col bg-white px-2 py-2">
        <div className="flex justify-between items-center gap-4 border-b-1  border-black text-nowrap pb-2">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 flex items-center justify-center text-gray-500">
              <WeatherIcon
                description={weather?.description || ""}
                height={64}
                width={64}
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <div className="text-4xl leading-none text-black">
                  {weather?.temperature}°C
                </div>
                <div className="font-geneva9 text-base text-gray-500">
                  Feels like {weather?.feelsLike}°C
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="flex flex-col gap-3 ml-3">
                  <div className="flex gap-1 items-center">
                    <div className="w-5 h-5 text-gray-500">
                      <TempUp />
                    </div>
                    <span className="text-xl leading-none text-black font-inter">
                      {weather?.highTemp}°
                    </span>
                  </div>
                  <div className="flex gap-1 items-center">
                    <div className="w-5 h-5 text-gray-500">
                      <TempDown />
                    </div>
                    <span className="text-xl leading-none text-black font-inter">
                      {weather?.lowTemp}°
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex gap-1 items-center">
                    <div className="w-5 h-5 text-gray-500">
                      <HumidityIcon />
                    </div>
                    <span className="text-xl leading-none text-black font-inter">
                      {weather?.humidity}%
                    </span>
                  </div>
                  <div className="flex gap-1 items-center">
                    <div className="w-5 h-5 text-gray-500">
                      <WindIcon />
                    </div>
                    <span className="text-xl leading-none text-black font-inter">
                      {weather?.windSpeed} m/s
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2 items-center">
                    <div className="w-6 h-6 text-gray-500">
                      <SunriseIcon />
                    </div>
                    <span className="text-xl leading-none text-black font-inter">
                      {weather?.sunrise}
                    </span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="w-6 h-6 text-gray-500">
                      <SunsetIcon />
                    </div>
                    <span className="text-xl leading-none text-black font-inter">
                      {weather?.sunset}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-[32px] leading-none text-gray-700  font-inter">
              {formatDateRu(new Date())}
            </div>
            <div className="text-base text-black font-geneva9">
              Last updated at {updatedAt}
            </div>
          </div>
        </div>

        {/* Crypto prices */}
        <div className="flex justify-between gap-3 pt-4 pb-4 border-b-1 border-black">
          {safeTokens.map((t, idx) => {
            const priceUsd = toNum((t as any).priceUsd);
            const change24hPct = toNum((t as any).change24hPct);

            const up = (change24hPct ?? 0) >= 0;
            const arrow = up ? "↑" : "↓";

            return (
              <div
                key={(t as any).id ?? idx}
                className="flex items-center gap-2"
              >
                <div className="w-7 h-7">
                  {t?.symbol === "BTC" ? (
                    <BitcoinIcon
                      className="text-gray-500"
                      width="100%"
                      height="auto"
                    />
                  ) : t?.symbol === "MET" ? (
                    <MeteoraIcon
                      className="text-gray-500"
                      width="100%"
                      height="auto"
                    />
                  ) : (
                    <SolIcon
                      className="text-gray-500"
                      width="100%"
                      height="auto"
                    />
                  )}
                </div>
                <div className="font-inter text-[32px] leading-none text-gray-900">
                  ${formatPrice(priceUsd)}
                </div>
                <span className="font-inter text-[16px] text-nowrap rounded-md border border-gray-500 text-gray-500 py-[1] px-[3]">
                  {arrow} {formatPct(change24hPct)}%
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex flex-1 justify-center items-center">
          <p className="font-inter text-4xl">
            Тебе надо заняться спортом, тюфяк
          </p>
        </div>

        {/* Crypto prices */}
        {/* <div className="flex flex-col justify-around gap-3">
          {safeTokens.map((t, idx) => {
            const priceUsd = toNum((t as any).priceUsd);
            const change24hPct = toNum((t as any).change24hPct);

            const up = (change24hPct ?? 0) >= 0;
            const arrow = up ? "↑" : "↓";

            return (
              <div
                key={(t as any).id ?? idx}
                className="flex items-center gap-4"
              >
                {t?.symbol === "BTC" ? (
                  <BitcoinIcon
                    className="text-gray-500"
                    height={60}
                    width={60}
                  />
                ) : t?.symbol === "MET" ? (
                  <MeteoraIcon
                    className="text-gray-500"
                    height={60}
                    width={60}
                  />
                ) : (
                  <SolIcon className="text-gray-500" height={60} width={60} />
                )}
                <div className="flex flex-col gap-1 items-start">
                  <div className="font-inter text-[32px] leading-none text-gray-900">
                    ${formatPrice(priceUsd)}
                  </div>
                  <span className="font-inter text-[16px] text-nowrap rounded-md border border-gray-500 text-gray-500 py-[1] px-[3]">
                    {arrow} {formatPct(change24hPct)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div> */}
      </div>
    </PreSatori>
  );
}
