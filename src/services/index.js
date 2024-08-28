"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export const createList = async (data) => {
  const { title } = data;
  let list;

  try {
    const lastList = await prisma.list.findFirst({
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastList ? lastList?.order + 1 : 1;

    list = await prisma.list.create({
      data: {
        title,
        order: newOrder,
      },
    });
  } catch (error) {
    return {
      error: "list not created",
    };
  }

  revalidatePath("/");
  return { data: list };
};

// update list
export const updateListOrder = async (data) => {
  let lists;

  try {
    lists = await prisma.$transaction(
      data?.items?.map((list) =>
        prisma.list.update({
          where: {
            id: list.id,
          },
          data: {
            order: list.order,
          },
        })
      )
    );
  } catch (error) {
    return {
      error: "failed to update",
    };
  }

  revalidatePath("/");
  return {
    data: lists,
  };
};

// update list
export const updateList = async (data) => {
  const { title, id } = data;
  let list;

  try {
    list = await prisma.list.update({
      where: {
        id,
      },
      data: {
        title,
      },
    });
  } catch (error) {
    return {
      error: "failed to update",
    };
  }

  revalidatePath("/");
  return {
    data: list,
  };
};

// copy list
export const copyList = async (data) => {
  const { id } = data;
  let list;

  try {
    const listToCopy = await prisma.list.findUnique({
      where: {
        id,
      },
      include: { cards: true },
    });

    if (!listToCopy) {
      return { error: "list not found" };
    }

    const lastList = await prisma.list.findFirst({
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastList ? lastList.order + 1 : 1;

    list = await prisma.list.create({
      data: {
        title: `${listToCopy.title} - copy`,
        order: newOrder,
        cards: listToCopy?.length
          ? {
              createMany: {
                data: listToCopy.cards?.map((card) => ({
                  title: card?.title,
                  desc: card?.desc,
                  order: card?.order,
                })),
              },
            }
          : {},
      },
      include: { cards: true },
    });
  } catch (error) {
    return {
      error: "failed to copy",
    };
  }
  revalidatePath("/");
  return { data: list };
};

// delete list
export const deleteList = async (data) => {
  const { id } = data;
  let list;
  try {
    list = await prisma.list.delete({
      where: { id },
    });
  } catch (error) {
    return {
      error: "failed to delete",
    };
  }

  revalidatePath("/");
  return { data: list };
};

// add card
export const createCard = async (data) => {
  const { userId } = auth();
  if (!userId) return { error: "unauthorized" };

  const { title, listId } = data;

  let card;

  try {
    const list = await prisma.list.findUnique({
      where: { id: listId },
    });
    console.log(list, "list");
    if (!list) {
      return {
        error: "list not found",
      };
    }

    const listCard = await prisma.card.findFirst({
      where: { listId },
      orderBy: { order: "desc" },
      select: { order: true },
    });
    console.log(listCard, "listCard");

    const newOrder = listCard ? listCard.order + 1 : 1;

    card = await prisma.card.create({
      data: {
        title,
        listId,
        order: newOrder,
      },
    });
  } catch (error) {
    return { error: "card not created" };
  }

  revalidatePath("/");
  return { data: card };
};

// update card ordered
export const updateCard = async (data) => {
  const { items } = data;

  let updatedCards;

  try {
    updatedCards = await prisma.$transaction(
      items.map((card) =>
        prisma.card.update({
          where: {
            id: card.id,
          },
          data: {
            order: card.order,
            listId: card.listId,
          },
        })
      )
    );
  } catch (error) {
    return { error: "failed to order" };
  }
  revalidatePath("/");
  return { data: updatedCards };
};
