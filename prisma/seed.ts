import { PrismaClient } from "@prisma/client";

const CATEGORIES = [
  "Tandoor Starter (Veg)",
  "Tandoor Starter (Non-Veg)",
  "Chinese Noodles & Rice (Veg)",
  "Chinese Noodles & Rice (Non-Veg)",
  "Kofta Khajana",
  "Kaju Flavor",
  "Chicken Main Course",
  "Fish Main Course",
  "Sizzler (Veg)",
  "Sizzler (Non-Veg)",
  "Veg Main Course",
  "Paneer Main Course",
  "Mushroom Flavor",
  "Dal",
  "Soups (Veg)",
  "Soups (Non-Veg)",
  "Chinese Starter (Veg)",
  "Chinese Starter (Non-Veg)",
  "Beverages",
  "Appetizer",
  "Indian Snacks (Veg)",
  "Indian Snacks (Non-Veg)",
  "Raita & Curd",
  "Biryani & Pulav",
  "Biryani",
  "Desert",
];

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Upsert admin PIN
  await prisma.admin.upsert({
    where: { pin: "458273" },
    update: {},
    create: { pin: "458273" },
  });
  console.log("✅ Admin PIN seeded: 458273");

  // Upsert all categories
  for (let i = 0; i < CATEGORIES.length; i++) {
    await prisma.category.upsert({
      where: { name: CATEGORIES[i] },
      update: { displayOrder: i },
      create: { name: CATEGORIES[i], displayOrder: i },
    });
  }
  console.log(`✅ ${CATEGORIES.length} categories seeded`);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
