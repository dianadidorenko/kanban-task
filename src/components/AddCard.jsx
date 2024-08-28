"use client";

import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import TextArea from "./TextArea";
import { useAction } from "@/hooks/useAction";
import { createCard } from "@/services";
import { toast } from "sonner";

const AddCard = ({ list }) => {
  const { result, fieldError } = useAction(createCard, {
    onSuccess: (data) => {
      toast.success(`${data.title} created`);
    },
    onError: (error) => {
      toast.error(error);
    },
  });
  const submit = (formData) => {
    const title = formData.get("title");

    result({ title, listId: list.id });
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="bg-rose-900 text-white w-full justify-end text-xs">
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
          <Button
            type="submit"
            className="rounded-md w-full h-auto px-5 py-2 text-xs duration-300"
          >
            Добавить
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default AddCard;
