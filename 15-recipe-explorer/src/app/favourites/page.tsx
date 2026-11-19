import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { Suspense } from "react";
import FavouriteButton from "@/components/favourite-button";
import {
  FAVOURITES_COOKIE,
  parseFavourites,
} from "@/lib/favourites";
import { getMeal } from "@/lib/mealdb";

function FavouritesSkeleton() {
  return (
    <div
      aria-label="Loading favourites"
      className="mt-8 grid animate-pulse grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: 3 }, (_, index) => (
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

async function FavouriteRecipes() {
  const cookieStore = await cookies();
  const parsed = parseFavourites(cookieStore.get(FAVOURITES_COOKIE)?.value);
  const meals = await Promise.all(parsed.ids.map((id) => getMeal(id)));
  const favourites = meals.filter((meal) => meal !== null);

  return (
    <>
      {parsed.issue && (
        <p
          className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950"
          role="status"
        >
          {parsed.issue} Save a recipe from its detail page to start a fresh
          list.
        </p>
      )}

      {favourites.length === 0 ? (
        <p className="mt-8 text-zinc-600">
          You haven&apos;t saved any recipes yet.{" "}
          <Link
            href="/"
            className="font-semibold text-amber-700 hover:text-amber-900"
          >
            Browse categories
          </Link>
        </p>
      ) : (
        <section
          aria-label="Favourite recipes"
          className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {favourites.map((meal) => (
            <article
              key={meal.idMeal}
              className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm"
            >
              <Link
                href={`/meal/${meal.idMeal}`}
                className="group block overflow-hidden"
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
              <div className="px-5 pb-5">
                <FavouriteButton
                  mealId={meal.idMeal}
                  initialFavourite
                />
              </div>
            </article>
          ))}
        </section>
      )}
    </>
  );
}

export default function FavouritesPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <header>
        <p className="text-sm font-semibold uppercase tracking-widest text-amber-600">
          Your collection
        </p>
        <h1 className="mt-2 text-4xl font-bold text-zinc-950">Favourites</h1>
      </header>
      <Suspense fallback={<FavouritesSkeleton />}>
        <FavouriteRecipes />
      </Suspense>
    </main>
  );
}
