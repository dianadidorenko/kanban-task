"use client";
import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { useAction } from "@/hooks/useAction";
import { deleteCard } from "@/services";
import { toast } from "sonner";
import { Trash } from "lucide-react";

const CardItem = ({ card, index }) => {
  const { result } = useAction(deleteCard, {
    onSuccess: () => {
      toast.success(`Card deleted`);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const handleDelete = () => {
    result({ id: card.id });
  };
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided) => (
        <>
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            role="button"
            className={`truncate py-2 px-3 text-sm rounded-md flex items-center justify-between shadow-md bg-[#4444440d] `}
          >
            {card.title}
            <button onClick={handleDelete} className="text-red-600">
              <Trash className="w-5 h-5" />
            </button>
          </div>
        </>
      )}
    </Draggable>
  );
};

export default CardItem;
