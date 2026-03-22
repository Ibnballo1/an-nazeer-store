import { db } from "./index";
import { categories, products } from "./schema";

async function seed() {
  console.log("🌱 Seeding database...");

  // ── Categories ──────────────────────────────────────────────────────────
  const insertedCategories = await db
    .insert(categories)
    .values([
      {
        name: "Natural Remedies",
        slug: "natural-remedies",
        description: "Certified herbal remedies for common health conditions",
        sortOrder: 1,
      },
      {
        name: "Food Spices",
        slug: "food-spices",
        description: "NAFDAC-approved natural food spices and condiments",
        sortOrder: 2,
      },
      {
        name: "Beauty & Skincare",
        slug: "beauty-skincare",
        description: "Natural beauty products for healthy, glowing skin",
        sortOrder: 3,
      },
      {
        name: "Wellness Solutions",
        slug: "wellness-solutions",
        description: "Holistic products for overall health and wellness",
        sortOrder: 4,
      },
      {
        name: "Natural Aphrodisiacs",
        slug: "natural-aphrodisiacs",
        description:
          "Natural products to support vitality and reproductive health",
        sortOrder: 5,
      },
      {
        name: "Gorontula Products",
        slug: "gorontula",
        description: "Premium Gorontula seed and syrup products",
        sortOrder: 6,
      },
    ])
    .returning();

  console.log(`✅ Inserted ${insertedCategories.length} categories`);

  // ── Sample Products ──────────────────────────────────────────────────────
  const gorontulaCategory = insertedCategories.find(
    (c) => c.slug === "gorontula",
  )!;
  const remediesCategory = insertedCategories.find(
    (c) => c.slug === "natural-remedies",
  )!;

  await db.insert(products).values([
    {
      categoryId: gorontulaCategory.id,
      name: "Gorontula Premium Syrup",
      slug: "gorontula-premium-syrup",
      shortDescription: "Natural Gorontula syrup for energy and vitality",
      description:
        "Our signature Gorontula syrup, carefully extracted from premium seeds. Rich in natural nutrients and traditionally used for energy, vitality, and overall wellness.",
      price: "5500.00",
      comparePrice: "7000.00",
      stock: 50,
      isFeatured: true,
      isBestSeller: true,
      isCertified: true,
      nafdacNumber: "NAFDAC/2024/001",
      benefits: [
        "Boosts energy",
        "Supports immunity",
        "Natural antioxidant",
        "Enhances vitality",
      ],
      unit: "250ml",
      status: "active",
    },
    {
      categoryId: remediesCategory.id,
      name: "Immune Boost Herbal Blend",
      slug: "immune-boost-herbal-blend",
      shortDescription:
        "Powerful herbal blend to strengthen your immune system",
      description:
        "A scientifically formulated blend of potent herbs to support and strengthen your immune system naturally.",
      price: "3800.00",
      comparePrice: "4500.00",
      stock: 75,
      isFeatured: true,
      isCertified: true,
      benefits: [
        "Strengthens immunity",
        "Fights infections",
        "Rich in antioxidants",
      ],
      unit: "60 capsules",
      status: "active",
    },
  ]);

  console.log("✅ Inserted sample products");
  console.log("🎉 Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
