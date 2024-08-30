import React from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import Listheader from "./Listheader";
import AddCard from "./AddCard";
import CardItem from "./CardItem";
import { cn } from "@/lib/utils";

const ListItem = ({ index, list }) => {
  return (
    <Draggable draggableId={list.id} index={index}>
      {(provided) => (
        <li
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="shrink-0 h-full w-full select-none shadow-lg px-2 py-4 rounded-md bg-[#ffffffcb] border-2 border-[#d2d2d284]"
        >
          <AddCard list={list} />
          <div {...provided.dragHandleProps} className="w-full py-2">
            <Listheader list={list} />

            <Droppable droppableId={list.id} type="card">
              {(provided) => (
                <ol
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={cn(
                    "mx-1 px-1 py-1 flex flex-col gap-y-3 rounded-md",
                    list.cards?.length > 0 ? "mt-1" : "mt-0"
                  )}
                >
                  {list?.cards?.map((card, index) => (
                    <CardItem index={index} key={card.id} card={card} />
                  ))}
                  {provided.placeholder}
                </ol>
              )}
            </Droppable>
          </div>
        </li>
      )}
    </Draggable>
  );
};

export default ListItem;
