/**
 * Утилиты для работы с Google Tasks API
 */

import type { GoogleTask } from "../types";

/**
 * Получить список задач из Google Tasks API
 * @param accessToken - токен доступа Google
 * @returns массив задач или пустой массив при ошибке
 */
export async function getGoogleTasks(
  accessToken?: string,
): Promise<GoogleTask[]> {
  // Если токена нет, возвращаем пустой массив
  if (!accessToken) {
    return [];
  }

  try {
    // Получаем список задач с указанными параметрами
    const response = await fetch(
      "https://www.googleapis.com/tasks/v1/users/@me/lists",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      console.error("Failed to fetch task lists:", response.statusText);
      return [];
    }

    const listsData = await response.json();
    const lists = listsData.items || [];

    // Получаем задачи из первого списка (обычно "My Tasks")
    if (lists.length === 0) {
      return [];
    }

    const firstListId = lists[0].id;

    const tasksResponse = await fetch(
      `https://www.googleapis.com/tasks/v1/lists/${firstListId}/tasks`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
        cache: "no-store",
      },
    );

    if (!tasksResponse.ok) {
      console.error("Failed to fetch tasks:", tasksResponse.statusText);
      return [];
    }

    const tasksData = await tasksResponse.json();
    const rawTasks = tasksData.items || [];

    // Преобразуем задачи в наш формат, ограничиваем до 10 задач
    return rawTasks.slice(0, 10).map((task: any) => ({
      id: task.id,
      title: task.title || "Без названия",
      completed: task.status === "completed",
      dueDate: task.due,
    }));
  } catch (error) {
    console.error("Error fetching Google Tasks:", error);
    return [];
  }
}
