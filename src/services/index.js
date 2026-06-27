"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export const createList = async (data) => {
  const { title } = data;
  try {
    const lastList = await prisma.list.findFirst({
      orderBy: { order: "desc" },
      select: { order: true },
    });
    const newOrder = lastList ? lastList.order + 1 : 1;
    const list = await prisma.list.create({
      data: { title, order: newOrder },
    });
    revalidatePath("/");
    return { data: list };
  } catch (error) {
    return { error: "list not created" };
  }
};

// Замена транзакции на Promise.all для MongoDB M0 (Shared Cluster)
export const updateListOrder = async (data) => {
  try {
    const updatePromises = data?.items?.map((list) =>
      prisma.list.update({
        where: { id: list.id },
        data: { order: list.order },
      }),
    );
    const lists = await Promise.all(updatePromises);
    revalidatePath("/");
    return { data: lists };
  } catch (error) {
    return { error: "failed to update" };
  }
};

export const updateList = async (data) => {
  const { title, id } = data;
  try {
    const list = await prisma.list.update({
      where: { id },
      data: { title },
    });
    revalidatePath("/");
    return { data: list };
  } catch (error) {
    return { error: "failed to update" };
  }
};

export const copyList = async (data) => {
  const { id } = data;
  try {
    const listToCopy = await prisma.list.findUnique({
      where: { id },
      include: { cards: true },
    });
    if (!listToCopy) return { error: "list not found" };

    const lastList = await prisma.list.findFirst({
      orderBy: { order: "desc" },
      select: { order: true },
    });
    const newOrder = lastList ? lastList.order + 1 : 1;

    const list = await prisma.list.create({
      data: {
        title: `${listToCopy.title} - copy`,
        order: newOrder,
        cards: listToCopy.cards?.length
          ? {
              create: listToCopy.cards.map((card) => ({
                title: card.title,
                desc: card.desc,
                order: card.order,
              })),
            }
          : {},
      },
      include: { cards: true },
    });
    revalidatePath("/");
    return { data: list };
  } catch (error) {
    return { error: "failed to copy" };
  }
};

export const deleteList = async (data) => {
  const { id } = data;
  try {
    const list = await prisma.list.delete({ where: { id } });
    revalidatePath("/");
    return { data: list };
  } catch (error) {
    return { error: "failed to delete" };
  }
};

export const createCard = async (data) => {
  const { title, listId, date } = data;

  // Проверка на случай путаницы при импорте инстанса Prisma
  const db = typeof prisma !== "undefined" ? prisma : null;

  if (!db) {
    return {
      error: "Критическая ошибка: База данных Prisma не инициализирована.",
    };
  }

  try {
    // Валидация ID для MongoDB (длина строки должна быть ровно 24 символа)
    if (!listId || listId.length !== 24) {
      console.error("Передан некорректный ID списка:", listId);
      return {
        error: "Невалидный ID колонки. Обновите структуру базы данных.",
      };
    }

    const parentList = await db.list.findUnique({
      where: { id: listId },
    });

    if (!parentList) {
      return { error: "Колонка не найдена в базе данных." };
    }

    const lastCard = await db.card.findFirst({
      where: { listId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastCard ? lastCard.order + 1 : 1;

    const card = await db.card.create({
      data: {
        title,
        listId,
        date: date ? new Date(date) : null,
        order: newOrder,
      },
    });

    console.log("Карточка успешно сохранена в MongoDB:", card);
    revalidatePath("/");
    return { data: card };
  } catch (error) {
    console.error("Ошибка выполнения createCard на бэкенде:", error);
    return { error: "Не удалось создать карточку в базе данных." };
  }
};

// Замена транзакции на Promise.all для изменения порядка карточек
export const updateCard = async (data) => {
  const { items } = data;
  try {
    const updatePromises = items.map((card) =>
      prisma.card.update({
        where: { id: card.id },
        data: {
          order: card.order,
          listId: card.listId,
        },
      }),
    );
    const updatedCards = await Promise.all(updatePromises);
    revalidatePath("/");
    return { data: updatedCards };
  } catch (error) {
    return { error: "failed to order" };
  }
};

export const updateCardDetails = async (data) => {
  const { id, title, desc, date } = data;
  try {
    const card = await prisma.card.update({
      where: { id },
      data: {
        title,
        desc,
        date: date ? new Date(date) : null,
      },
    });
    revalidatePath("/");
    return { data: card };
  } catch (error) {
    return { error: "failed to update card" };
  }
};

export const deleteCard = async (data) => {
  const { id } = data;
  try {
    const card = await prisma.card.delete({ where: { id } });
    revalidatePath("/");
    return { data: card };
  } catch (error) {
    return { error: "failed to delete card" };
  }
};
