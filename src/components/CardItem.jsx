"use client";

import React, { useEffect, useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { useAction } from "@/hooks/useAction";
import { deleteCard, updateCardDetails } from "@/services";
import { toast } from "sonner";
import { Edit2, Loader, Trash } from "lucide-react";

const CardItem = ({ card, index }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [date, setDate] = useState(
    card.date ? new Date(card.date).toISOString().split("T")[0] : ""
  );
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    if (card.date) {
      const options = { year: "numeric", month: "short", day: "2-digit" };
      setFormattedDate(
        new Intl.DateTimeFormat("ru-RU", options).format(new Date(card.date))
      );
    }
  }, [card.date]);

  const { result: deleteResult } = useAction(deleteCard, {
    onSuccess: () => {
      toast.success(`Card deleted`);
      setIsLoading(false);
    },
    onError: (error) => {
      toast.error(error);
      setIsLoading(false);
    },
  });

  const { result: updateResult } = useAction(updateCardDetails, {
    onSuccess: () => {
      toast.success(`Card updated`);
      setIsEditing(false);
      setIsLoading(false);
    },
    onError: (error) => {
      toast.error(error);
      setIsLoading(false);
    },
  });

  const handleDelete = () => {
    deleteResult({ id: card.id });
    setIsLoading(true);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleUpdate = () => {
    updateResult({ id: card.id, title, date });
  };

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="flex flex-col justify-between gap-2 bg-[rgb(244,237,237)] border-2 border-[#d2d2d225] p-2 rounded-br-xl rounded-bl-xl shadow-md"
        >
          {isEditing ? (
            <div className="flex flex-col gap-4">
              <textarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="border p-1 rounded-md w-full h-full"
              />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border p-1 rounded-md"
              />
              <button onClick={handleUpdate} className="text-green-600">
                Сохранить
              </button>
            </div>
          ) : (
            <div className="flex flex-col justify-between gap-2">
              <div className="text-gray-800/80 text-sm font-semibold underline">
                {formattedDate}
              </div>
              <div className="truncate w-full text-wrap font-light text-base">
                {card.title}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 ml-2">
            {!isEditing && (
              <button
                onClick={handleEdit}
                disabled={isLoading}
                className="text-blue-900 hover:bg-blue-900 hover:text-white duration-500 hover:rounded-full p-2"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={handleDelete}
              className="text-rose-900 hover:bg-rose-900 hover:text-white duration-500 hover:rounded-full p-2"
            >
              {isLoading ? (
                <Loader className="animate-spin w-5 h-5" />
              ) : (
                <Trash className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default CardItem;
