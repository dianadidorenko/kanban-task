"use client";

import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import { Loader, Plus } from "lucide-react";
import TextArea from "./TextArea";
import { useAction } from "@/hooks/useAction";
import { createCard } from "@/services";
import { toast } from "sonner";

const AddCard = ({ list }) => {
  const [date, setDate] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { result, fieldError } = useAction(createCard, {
    onSuccess: (data) => {
      toast.success(`${data.title} created`);
      setIsLoading(false);
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error(error);
      setIsLoading(false);
    },
  });

  const submit = (formData) => {
    const title = formData.get("title");
    setIsLoading(true);
    result({ title, date, listId: list.id });
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-rose-900 text-white w-full justify-end text-xs"
        >
          <Plus className="h-[13px] w-[13px] mr-1" />
          Добавить
        </Button>
      </PopoverTrigger>

      <PopoverContent className="px-2 pt-3 bg-white">
        <form action={submit}>
          <TextArea
            id="title"
            placeholder="Введите название карточки"
            errors={fieldError}
            className="outline-none border border-slate-300 rounded-md shadow-md p-1 placeholder:text-sm w-full"
          />
          <div className="mt-2">
            <label
              htmlFor="date"
              className="block text-sm font-semibold text-slate-700"
            >
              Выберите дату
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border p-1 rounded-md w-full"
            />
          </div>
          <Button
            type="submit"
            className={`rounded-md w-full h-auto px-5 py-2 text-xs duration-300 mt-2 ${
              isLoading ? "bg-gray-400 cursor-not-allowed" : ""
            } flex items-center justify-center`}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="animate-spin w-5 h-5" />
            ) : (
              "Добавить"
            )}
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default AddCard;
