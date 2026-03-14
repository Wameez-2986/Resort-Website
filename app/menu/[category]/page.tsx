import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, UtensilsCrossed } from "lucide-react";
import { CategoryItemCards } from "@/components/category-item-cards";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categoryId } = await params;

  const data = await prisma.category.findUnique({
    where: { id: categoryId },
    include: {
      menuItems: {
        where: { available: true },
        orderBy: { name: "asc" },
      },
    },
  });

  if (!data) {
    notFound();
  }

  return (
    <div className="w-full flex flex-col min-h-screen pb-32">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 w-full bg-[#0F0F0F]/90 backdrop-blur-md border-b border-white/10 px-4 py-4 md:px-8 flex flex-col gap-4">
        <div className="flex items-center w-full max-w-5xl mx-auto">
          <Link
            href="/menu"
            className="p-2 -ml-2 text-white/70 hover:text-accent transition-colors flex items-center justify-center rounded-full hover:bg-white/5"
            aria-label="Back to Menu"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
        </div>

        {/* Category Title */}
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
          <h2 className="text-2xl md:text-3xl font-montserrat font-semibold text-accent text-center mb-1">
            {data.name}
          </h2>
          <div className="w-12 h-0.5 bg-accent/50 rounded-full" />
        </div>
      </header>

      {/* Menu Items */}
      <main className="w-full max-w-5xl mx-auto px-4 md:px-8 py-8 flex-1">
        {data.menuItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24 text-white/30">
            <UtensilsCrossed className="w-12 h-12 opacity-40" />
            <p className="font-montserrat text-lg">No items in this category yet.</p>
            <p className="font-montserrat text-sm opacity-60">
              Check back soon — our chefs are working on it!
            </p>
          </div>
        ) : (
          <CategoryItemCards items={data.menuItems} />
        )}
      </main>
    </div>
  );
}
