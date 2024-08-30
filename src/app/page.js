import ListContainer from "@/components/ListContainer";
import prisma from "@/lib/db";

export default async function Home() {
  const lists = await prisma.list.findMany({
    include: {
      cards: {
        orderBy: {
          order: "asc",
        },
      },
    },
    orderBy: {
      order: "asc",
    },
  });
  return (
    <div className="px-6 lg:px-10 pt-2 pb-10 lg:pt-6 h-screen overflow-x-auto bg-[#d2d2d26c]">
      <ListContainer lists={lists} />
    </div>
  );
}
