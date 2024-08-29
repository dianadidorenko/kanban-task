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
    <div className="px-6 lg:px-20 py-10 lg:py-20 h-screen overflow-x-auto bg-[#c0c0c06c]">
      <ListContainer lists={lists} />
    </div>
  );
}
