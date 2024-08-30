"use client";
import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import ListItem from "./ListItem";
import CreateList from "./CreateList";
import { useAction } from "@/hooks/useAction";
import { updateCard, updateListOrder } from "@/services";
import { toast } from "sonner";

function reorder(list, startIndex, endIndex) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

const ListContainer = ({ lists }) => {
  const [listData, setListData] = useState(lists);

  useEffect(() => {
    setListData(lists);
  }, [lists]);

  // update list
  const { result } = useAction(updateListOrder, {
    onSuccess: () => {
      toast.success(`list order updated`);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  // update cards
  const { result: updateCards } = useAction(updateCard, {
    onSuccess: () => {
      toast.success(`list order updated`);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onDragEnd = (draggedData) => {
    const { destination, source, type } = draggedData;

    if (!destination) return;

    if (
      destination?.droppableId == source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type == "list") {
      const items = reorder(listData, source.index, destination.index).map(
        (item, index) => ({ ...item, order: index })
      );
      setListData(items);
      result({ items });
    }

    if (type == "card") {
      let newOrderedData = [...listData];

      const sourceList = newOrderedData.find(
        (list) => list.id == source.droppableId
      );

      const destinationList = newOrderedData.find(
        (list) => list.id == destination.droppableId
      );

      if (!sourceList || !destinationList) return;
      if (!sourceList.cards) sourceList.cards = [];
      if (!destinationList.cards) destinationList.cards = [];

      if (source.droppableId == destination.droppableId) {
        const reOrderedCards = reorder(
          sourceList.cards,
          source.index,
          destination.index
        );
        reOrderedCards.forEach((card, idx) => {
          card.order = idx;
        });
        sourceList.cards = reOrderedCards;
        setListData(newOrderedData);
        updateCards({ items: destinationList.cards });
      } else {
        const [movedCard] = sourceList.cards.splice(source.index, 1);
        movedCard.listId = destination.droppableId;

        destinationList.cards.splice(destination.index, 0, movedCard);
        sourceList.cards.forEach((card, idx) => {
          card.order = idx;
        });

        destinationList.cards.forEach((card, idx) => {
          card.order = idx;
        });

        setListData(newOrderedData);
        updateCards({ items: destinationList.cards });
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
          >
            {listData.map((list, index) => (
              <ListItem
                key={list.id}
                index={index}
                list={list}
              />
            ))}
            {provided.placeholder}
            {/* <CreateList /> */}
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ListContainer;
