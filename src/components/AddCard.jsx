"use client";

import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import { Loader, Plus } from "lucide-react";
import { createCard } from "@/services";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const AddCard = ({ list }) => {
  const [date, setDate] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [titleValue, setTitleValue] = useState("");

  const router = useRouter();

  const handleCardSubmit = async (e) => {
    // 1. Обязательно предотвращаем стандартное поведение браузера
    if (e) e.preventDefault();

    // ЭТОТ ЛОГ ДОЛЖЕН ПОЯВИТЬСЯ В КОНСОЛИ БРАУЗЕРА (F12) ПРИ КЛИКЕ:
    console.log(
      "Клик сработал! Пытаемся создать карточку со значением:",
      titleValue,
    );

    if (!titleValue.trim()) {
      toast.error("Пожалуйста, введите название карточки");
      return;
    }

    setIsLoading(true);

    try {
      const response = await createCard({
        title: titleValue.trim(),
        date: date || null,
        listId: list.id,
      });

      console.log("Ответ от сервера в компоненте:", response);

      if (response?.error) {
        toast.error(response.error);
      } else if (response?.data) {
        toast.success(`Карточка "${response.data.title}" создана!`);
        setTitleValue("");
        setDate("");
        setIsOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Критическая ошибка при отправке:", error);
      toast.error("Произошла непредвиденная ошибка");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-rose-900 text-white w-full justify-end text-xs duration-300 h-10"
        >
          <Plus className="h-[13px] w-[13px] mr-1" />
          Добавить
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="px-2 pt-3 bg-white"
        side="bottom"
        align="start"
      >
        <form onSubmit={handleCardSubmit}>
          {/* Стандартный проверенный textarea */}
          <textarea
            id="title"
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
            placeholder="Введите название карточки"
            rows={3}
            className="outline-none border border-slate-300 rounded-md shadow-md p-1 placeholder:text-sm w-full resize-none text-black"
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
              className="border p-1 rounded-md w-full text-black"
            />
          </div>

          <Button
            type="submit"
            onClick={handleCardSubmit} // Дублируем триггер на случай, если форма блокирует сабмит
            className={`rounded-md w-full h-auto px-5 py-2 text-xs duration-300 mt-2 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-slate-900 text-white"
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
