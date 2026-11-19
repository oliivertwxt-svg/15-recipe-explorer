import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import SearchBox from "@/components/search-box";
import { searchMeals } from "@/lib/mealdb";

export const metadata: Metadata = {
  title: "Search Recipes | Recipe Explorer",
  description: "Search recipes from TheMealDB.",
};

type SearchPageProps = {
  searchParams: Promise<{ q?: string | string[] }>;
};

function SearchResultsLoading() {
  return (
    <div
      aria-label="Loading search results"
      className="mt-8 grid animate-pulse grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-zinc-200"
        >
          <div className="aspect-[4/3] bg-zinc-200" />
          <div className="p-5">
            <div className="h-5 w-3/4 rounded bg-zinc-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

async function SearchResults({ query }: { query: string }) {
  if (query.length < 2) {
    return (
      <p className="mt-8 text-zinc-600">
        Enter at least 2 characters to search for recipes.
      </p>
    );
  }

  const meals = await searchMeals(query);

  if (meals.length === 0) {
    return (
      <p className="mt-8 text-zinc-600">
        No recipes found for &quot;{query}&quot;.
      </p>
    );
  }

  return (
    <section
      aria-label="Search results"
      className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
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
          <div className="p-5">
            <h2 className="text-lg font-semibold text-zinc-950">
              {meal.strMeal}
            </h2>
            <p className="mt-1 text-sm text-zinc-600">
              {meal.strArea} &middot; {meal.strCategory}
            </p>
          </div>
        </Link>
      ))}
    </section>
  );
}

async function SearchPageContent({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = (Array.isArray(q) ? q[0] : q)?.trim() ?? "";

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <header>
        <p className="text-sm font-semibold uppercase tracking-widest text-amber-600">
          TheMealDB
        </p>
        <h1 className="mt-2 text-4xl font-bold text-zinc-950">
          Search recipes
        </h1>
      </header>

      <div className="mt-6">
        <SearchBox initialQuery={query} />
      </div>

      {query.length >= 2 && (
        <h2 className="mt-6 text-lg font-semibold text-zinc-800">
          Results for &quot;{query}&quot;
        </h2>
      )}

      <Suspense fallback={<SearchResultsLoading />}>
        <SearchResults query={query} />
      </Suspense>
    </main>
  );
}

function SearchPageLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl animate-pulse px-6 py-12">
      <div className="h-4 w-24 rounded bg-zinc-200" />
      <div className="mt-3 h-10 w-64 rounded bg-zinc-200" />
      <div className="mt-6 h-12 w-full max-w-2xl rounded-xl bg-zinc-200" />
    </main>
  );
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <Suspense fallback={<SearchPageLoading />}>
      <SearchPageContent searchParams={searchParams} />
    </Suspense>
  );
}
