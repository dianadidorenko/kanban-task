// src/app/page.js
import ListContainer from "@/components/ListContainer";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  let lists = await db.list.findMany({
    include: {
      cards: {
        orderBy: { order: "asc" },
      },
    },
    orderBy: { order: "asc" },
  });

  lists = await db.list.findMany({
    include: {
      cards: {
        orderBy: { order: "asc" },
      },
    },
    orderBy: { order: "asc" },
  });

  return (
    <div className="px-6 lg:px-10 pt-2 pb-10 lg:pt-6 h-screen overflow-x-auto bg-[#d2d2d26c]">
      <ListContainer lists={lists} />
    </div>
  );
}
