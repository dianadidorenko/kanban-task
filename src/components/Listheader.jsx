"use client";
import React, { useRef, useState } from "react";
import FormInput from "./FormInput";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { updateList } from "@/services";
import { toast } from "sonner";
import { useAction } from "@/hooks/useAction";
// import ListOptions from "./ListOptions";
import useEventListener from "@/lib/useEventListener";

const Listheader = ({ list }) => {
  const [title, setTitle] = useState(list?.title);
  const [isEditable, setIsEditable] = useState(false);
  const formRef = useRef(null);
  const inputRef = useRef(null);

  const enableEditing = () => {
    setIsEditable(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  const { result } = useAction(updateList, {
    onSuccess: (data) => {
      toast.success(`${data.title} updated`);
      setTitle(data.title);
      setIsEditable(false);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const handleSubmit = async (formData) => {
    const title = formData.get("title");
    const id = formData.get("id");
    if (title == list.title) {
      return setIsEditable(false);
    }
    result({ title, id });
  };

  const onKeyDown = (e) => {
    if (e.key == "Escape") {
      setIsEditable(false);
    }
  };

  useEventListener("keydown", onKeyDown);
  return (
    <div className="px-2 text-sm font-semibold flex justify-between items-center pointer-events-none">
      {isEditable ? (
        <form action={handleSubmit} ref={formRef}>
          <input hidden id="id" name="id" value={list.id} />
          <FormInput
            ref={inputRef}
            id="title"
            defaultValue={title}
            className="w-full rounded-md text-sm py-1 px-2 border-transparent font-medium focus:outline-none hover:border-input focus:border-2 focus:border-white transition"
            placeholder="Enter list name"
            errors={"errors"}
          />
          <div className="flex items-center justify-between">
            <Button
              type="submit"
              size="sm"
              className="bg-rose-900 text-white text-xs"
            >
              Обновить
            </Button>
            <button onClick={() => setIsEditable(false)}>
              <X className="h-5 w-5 text-rose-900" />
            </button>
          </div>
        </form>
      ) : (
        <div
          className="w-full text-base px-2.5 py-2 font-extralight text-center"
          onClick={enableEditing}
        >
          {title}
        </div>
      )}
      {/* <ListOptions list={list} /> */}
    </div>
  );
};

export default Listheader;
