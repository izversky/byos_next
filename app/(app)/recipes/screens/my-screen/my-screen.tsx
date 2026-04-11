import { PreSatori } from "@/utils/pre-satori";
import {
	HumidityIcon,
	WindIcon,
	SunsetIcon,
	SunriseIcon,
	TempUp,
	TempDown,
	BitcoinIcon,
	MeteoraIcon,
	SolIcon,
} from "./icons";
import { WeatherIcon } from "./components";
import {
	formatDateRu,
	formatPrice,
	formatPct,
	toNum,
	getProgressData,
} from "./utils";
import type { ScreenProps } from "./types";

export default function Screen({
	tokens,
	updatedAt,
	weather,
	tasks = [],
	width = 800,
	height = 480,
}: ScreenProps) {
	const safeTokens = Array.isArray(tokens) ? tokens : [];
	const safeTasks = Array.isArray(tasks) ? tasks : [];
	const { isExpired, remainingDays, remainingHours } = getProgressData();

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
						<div className="text-[32px] leading-none text-black  font-inter">
							{formatDateRu(new Date())}
						</div>
						<div className="text-base text-black font-geneva9">
							Last updated at{" "}
							{new Date(updatedAt).toLocaleTimeString("ru-RU", {
								hour: "2-digit",
								minute: "2-digit",
							})}
						</div>
					</div>
				</div>

				<div className="flex flex-1 justify-start items-start max-h-[350px]">
					<div className="flex flex-col h-full w-1/2 py-2 overflow-y-hidden pr-2">
						<div className="flex justify-between items-center mb-2">
							<div className="text-2xl leading-none text-black font-inter font-bold">
								Важно выполнить
							</div>
							<div className="text-sm leading-none text-gray-500 font-inter">
								{tasks.length} задач
								{tasks.length === 0 || tasks.length > 4
									? ""
									: tasks.length === 1
										? "а"
										: "и"}
							</div>
						</div>

						{safeTasks?.length > 0 ? (
							<div className="flex flex-col gap-2">
								{safeTasks.map((task) => (
									<div key={task.id} className="flex items-start gap-2">
										<div className="w-4 h-4 mt-1.5 shrink-0 rounded-full border border-gray-700" />
										<div className="flex-1 min-w-0">
											<div className="text-xl text-black font-inter wrap-break-word">
												{task.title}
											</div>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="flex items-center justify-center h-full ">
								<div className="text-3xl text-gray-500 font-inter">
									Нет задач
								</div>
							</div>
						)}
					</div>
					<div className="flex-1 flex items-center justify-center border-l-1 border-black max-h-[350px] h-full pl-2">
						<div className="flex flex-col h-full w-full justify-center items-center">
							{/* Информация об оставшемся времени */}
							<div className="flex items-center gap-5">
								<div className="flex flex-col text-center">
									<div className="text-5xl font-inter font-bold text-black leading-tight">
										{remainingDays}
									</div>
									<div className="text-xl text-black font-inter">
										{remainingDays?.toString().slice(-1) === "1"
											? "день"
											: "дней"}
									</div>
								</div>

								<div className="text-lg text-black font-inter">и</div>
								<div className="flex flex-col text-center">
									<div className="text-5xl font-inter font-bold text-black leading-tight">
										{remainingHours}
									</div>
									<div className="text-xl text-black font-inter">
										{remainingHours === 1
											? "час"
											: remainingHours > 1 && remainingHours < 5
												? "часа"
												: "часов"}
									</div>
								</div>
							</div>

							<div className="flex flex-col mt-6 text-center border-t-1 border-black pt-3 w-full">
								<div className="text-lg text-gray-600 font-inter">
									До события
								</div>
								<div className="text-xl text-black font-inter font-semibold">
									30 май, 14:30 (UTC+2)
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Crypto prices section */}
				<div className="flex justify-between gap-3 pt-2 border-t-1 border-black">
					{safeTokens.map((token) => {
						const priceUsd = toNum(token.priceUsd);
						const change24hPct = toNum(token.change24hPct);
						const isUp = (change24hPct ?? 0) >= 0;
						const arrow = isUp ? "↑" : "↓";

						return (
							<div key={token.id} className="flex items-center gap-2">
								<div className="w-7 h-7">
									{token.symbol === "BTC" ? (
										<BitcoinIcon
											className="text-gray-500"
											width="100%"
											height="auto"
										/>
									) : token.symbol === "MET" ? (
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
			</div>
		</PreSatori>
	);
}
