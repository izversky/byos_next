/**
 * Утилиты для расчёта данных прогресс-шкалы
 */

export interface ProgressData {
	remainingDays: number;
	remainingHours: number;
	isExpired: boolean;
}

/**
 * Получает данные для визуализации прогресса до события
 * Целевая дата: 30 мая 2026 14:30 по украинскому времени (UTC+2)
 *
 * @param now - текущая дата (по умолчанию текущий момент)
 * @returns объект с данными для отображения на экране
 */
export function getProgressData(now: Date = new Date()): ProgressData {
	// Целевая дата: 30 мая 2026 14:30 по украинскому времени (UTC+2)
	// В UTC это будет 30 мая 2026 12:30
	const target = new Date("2026-05-30T12:30:00Z");

	// Если событие уже произошло
	if (now >= target) {
		return {
			remainingDays: 0,
			remainingHours: 0,
			isExpired: true,
		};
	}

	// Дата начала для расчета прогресса (30 дней до события)
	const startDate = new Date(target);
	startDate.setDate(startDate.getDate() - 30);

	// Оставшееся время
	const remainingTime = target.getTime() - now.getTime();
	const remainingDays = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
	const remainingHours = Math.floor(
		(remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
	);

	return {
		remainingDays,
		remainingHours,
		isExpired: false,
	};
}
