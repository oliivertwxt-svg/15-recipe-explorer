import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories, getMealsByCategory } from "@/lib/mealdb";

type CategoryPageProps = {
  params: Promise<{ name: string }>;
};

export async function generateStaticParams() {
  const categories = await getCategories();

  return categories.map((category) => ({
    name: category.strCategory,
  }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { name } = await params;
  const categoryName = decodeURIComponent(name);

  return {
    title: `${categoryName} Recipes | Recipe Explorer`,
    description: `Browse ${categoryName} recipes from TheMealDB.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { name } = await params;
  const categoryName = decodeURIComponent(name);
  const categories = await getCategories();
  const category = categories.find(
    (item) =>
      item.strCategory.toLowerCase() === categoryName.toLowerCase(),
  );

  if (!category) {
    notFound();
  }

  const meals = await getMealsByCategory(category.strCategory);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <Link
        href="/"
        className="text-sm font-semibold text-amber-700 hover:text-amber-900"
      >
        &larr; All categories
      </Link>

      <header className="mb-8 mt-4">
        <h1 className="text-4xl font-bold text-zinc-950">
          {category.strCategory} Recipes
        </h1>
      </header>

      {meals.length === 0 ? (
        <p className="text-zinc-600">No meals found in this category.</p>
      ) : (
        <section
          aria-label={`${category.strCategory} meals`}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {meals.map((meal) => (
            <Link
              key={meal.idMeal}
              href={`/meal/${meal.idMeal}`}
              className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
                <Image
                  src={meal.strMealThumb}
                  alt={meal.strMeal}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
              <h2 className="p-5 text-lg font-semibold text-zinc-950">
                {meal.strMeal}
              </h2>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}
