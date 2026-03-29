/**
 * Отображение погодного иконки на основе описания погоды
 * Встроенная логика для определения типа погоды
 */

import {
	CloudIcon,
	FogIcon,
	RainIcon,
	SnowIcon,
	SunIcon,
	ThunderIcon,
} from "../icons";

interface WeatherIconProps extends React.SVGProps<SVGSVGElement> {
	description: string;
}

/**
 * Компонент для отображения иконки погоды
 * Автоматически выбирает иконку на основе текстового описания
 *
 * @param description - описание погоды на русском языке
 * @param props - стандартные SVG props
 * @returns соответствующий компонент иконки или null
 */
export function WeatherIcon({
	description,
	...props
}: WeatherIconProps): React.ReactNode {
	const lowerDesc = description.toLowerCase();

	// Дождь
	if (
		lowerDesc.includes("дождь") ||
		lowerDesc.includes("морось") ||
		lowerDesc.includes("ливни")
	) {
		return <RainIcon {...props} />;
	}

	// Снег
	if (
		lowerDesc.includes("снегопад") ||
		lowerDesc.includes("снежные") ||
		lowerDesc.includes("снег")
	) {
		return <SnowIcon {...props} />;
	}

	// Облачность
	if (
		lowerDesc.includes("облачность") ||
		lowerDesc.includes("облачно") ||
		lowerDesc.includes("облако")
	) {
		return <CloudIcon {...props} />;
	}

	// Ясное небо / Солнечно
	if (
		lowerDesc.includes("ясное") ||
		lowerDesc.includes("ясно") ||
		lowerDesc.includes("ясн") ||
		lowerDesc.includes("солнечно")
	) {
		return <SunIcon {...props} />;
	}

	// Туман
	if (
		lowerDesc.includes("туман") ||
		lowerDesc.includes("изморозь") ||
		lowerDesc.includes("мгла")
	) {
		return <FogIcon {...props} />;
	}

	// Гроза
	if (lowerDesc.includes("гроза")) {
		return <ThunderIcon {...props} />;
	}

	// По умолчанию ничего не возвращаем
	return null;
}
