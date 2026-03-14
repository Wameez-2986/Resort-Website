import prisma from "@/lib/prisma";
import { MenuClient } from "@/components/menu-client";

export default async function MenuPage() {
  // Parallel fetch categories and menu items
  const [categories, searchData] = await Promise.all([
    prisma.category.findMany({
      orderBy: { displayOrder: "asc" },
    }),
    prisma.category.findMany({
      include: {
        menuItems: {
          where: { available: true },
          orderBy: { name: "asc" },
        },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  return <MenuClient initialCategories={categories} searchData={searchData} />;
}
