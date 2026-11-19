import Image from "next/image";
import Link from "next/link";
import { getCategories } from "@/lib/mealdb";

export default async function Home() {
  const categories = await getCategories();

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-amber-600">
          TheMealDB
        </p>
        <h1 className="mt-2 text-4xl font-bold text-zinc-950">
          Recipe Explorer
        </h1>
      </header>

      <section
        aria-label="Recipe categories"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {categories.map((category) => (
          <Link
            key={category.idCategory}
            href={`/category/${encodeURIComponent(category.strCategory)}`}
            className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
              <Image
                src={category.strCategoryThumb}
                alt={category.strCategory}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <h2 className="text-xl font-semibold text-zinc-950">
                {category.strCategory}
              </h2>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-600">
                {category.strCategoryDescription}
              </p>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
