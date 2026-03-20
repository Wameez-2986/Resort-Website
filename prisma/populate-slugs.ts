import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

async function main() {
  const categories = await prisma.category.findMany();
  console.log(`Found ${categories.length} categories.`);

  for (const category of categories) {
    const slug = slugify(category.name);
    console.log(`Updating ${category.name} -> ${slug}`);
    await prisma.category.update({
      where: { id: category.id },
      data: { slug },
    });
  }

  console.log("Done!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
