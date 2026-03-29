/**
 * Утилиты для форматирования данных
 */

/**
 * Конвертирует значение в число безопасно
 * @param value - значение для конвертации
 * @returns число или null если конвертация невозможна
 */
export function toNum(value: unknown): number | null {
	if (value == null) return null;
	const n = typeof value === "number" ? value : Number(value);
	return Number.isFinite(n) ? n : null;
}

/**
 * Форматирует цену в USD с локализацией
 * @param price - цена для форматирования
 * @returns отформатированная строка цены или "N/A"
 */
export function formatPrice(price: number | null): string {
	if (price == null) return "N/A";
	return price.toLocaleString("en-US", {
		maximumFractionDigits: 2,
	});
}

/**
 * Форматирует процент с 2 знаками после запятой
 * @param percentage - процент для форматирования
 * @returns отформатированная строка процента или "N/A"
 */
export function formatPct(percentage: number | null): string {
	if (percentage == null) return "N/A";
	return Math.abs(percentage).toFixed(2);
}

/**
 * Форматирует дату в русском формате (День недели, число)
 * @param date - дата для форматирования
 * @returns строка вида "ПН, 14"
 */
export function formatDateRu(date: Date): string {
	const daysOfWeek = ["ВС", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"];
	const dayOfWeek = daysOfWeek[date.getDay()];
	const dayOfMonth = date.getDate();
	return `${dayOfWeek}, ${dayOfMonth}`;
}

/**
 * Форматирует текущее время в стандартный формат
 * @returns строка вида "Jan 1, 12:00"
 */
export function formatNow(): string {
	return new Date().toLocaleString("en-US", {
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	});
}

/**
 * Форматирует время из ISO строки
 * @param timeString - ISO время строка
 * @returns отформатированное время вида "12:00"
 */
export function formatTime(timeString: string): string {
	const date = new Date(timeString);
	return date.toLocaleString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	});
}
