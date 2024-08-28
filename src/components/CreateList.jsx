"use client";
import React, { useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import FormInput from "./FormInput";
import { Button } from "./ui/button";
import { useAction } from "@/hooks/useAction";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createList } from "@/services";
import useEventListener from "@/lib/useEventListener";

const CreateList = () => {
  const router = useRouter();
  const inputRef = useRef(null);
  const [isEditAble, setIsEditAble] = useState(false);

  const { result, fieldErrors } = useAction(createList, {
    onSuccess: (data) => {
      toast.success(`${data.title} created`);
      setIsEditAble(false);
      router.refresh();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onKeyDown = (e) => {
    if (e.key == "Escape") {
      setIsEditAble(false);
    }
  };

  useEventListener("keydown", onKeyDown);

  const submit = (data) => {
    const title = data.get("title");
    result({ title });
    setIsEditAble(false);
  };

  const editEnable = () => {
    setIsEditAble(true);
    setTimeout(() => {
      inputRef.current?.focus();
    });
  };
  if (isEditAble) {
    return (
      <li className="shrink-0 h-full w-[272px] select-none">
        <form
          action={submit}
          className="bg-white rounded-md w-full space-y-4 shadow-lg p-3"
        >
          <FormInput
            ref={inputRef}
            id="title"
            className="w-full rounded-md text-sm p-3 h-7 border-transparent font-medium focus:outline-none hover:border-input focus:border-2 focus:border-slate-400 transition"
            placeholder="Enter list name"
            errors={"errors"}
          />
          <div className="flex items-center justify-between">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="bg-black text-white"
            >
              Создать
            </Button>
            <button onClick={() => setIsEditAble(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>
        </form>
      </li>
    );
  }
  return (
    <li className="shrink-0 h-full w-[272px] select-none mt-1.5 p-1">
      <button
        onClick={editEnable}
        className="w-full rounded-lg bg-white text-black transition p-4 flex items-center font-medium text-sm mt-8"
      >
        <Plus className="h-4 w-4 mr-2" /> Добавить
      </button>
    </li>
  );
};

export default CreateList;
