"use client";
import React from "react";
import { Draggable } from "@hello-pangea/dnd";

const CardItem = ({ card, index }) => {
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          role="button"
          className={`truncate py-2 px-3 text-sm rounded-md shadow-md bg-[#4444440d] `}
        >
          {card.title}
        </div>
      )}
    </Draggable>
  );
};

export default CardItem;
