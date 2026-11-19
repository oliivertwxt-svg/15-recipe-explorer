import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { Suspense } from "react";
import FavouriteButton from "@/components/favourite-button";
import {
  FAVOURITES_COOKIE,
  parseFavourites,
} from "@/lib/favourites";
import { getMeal, getMealsByCategory } from "@/lib/mealdb";
import { getYoutubeEmbedUrl } from "@/lib/youtube";
import IngredientsChecklist from "./ingredients-checklist";
import MealLoading from "./loading";

type MealPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: MealPageProps): Promise<Metadata> {
  const { id } = await params;
  const meal = await getMeal(id);

  return {
    title: meal ? `${meal.strMeal} | Recipe Explorer` : "Recipe not found",
    description: meal
      ? `${meal.strMeal}, a ${meal.strArea} recipe in ${meal.strCategory}.`
      : "This recipe could not be found.",
  };
}

function MoreFromCategorySkeleton() {
  return (
    <section aria-label="More recipes loading" className="mt-12 animate-pulse">
      <div className="mb-6 h-8 w-64 rounded bg-zinc-200" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-xl border border-zinc-200"
          >
            <div className="aspect-square bg-zinc-200" />
            <div className="h-5 bg-zinc-200 p-4" />
          </div>
        ))}
      </div>
    </section>
  );
}

async function MoreFromCategory({
  category,
  currentMealId,
}: {
  category: string;
  currentMealId: string;
}) {
  const meals = await getMealsByCategory(category);

  if (process.env.NODE_ENV === "development") {
    await new Promise<void>((resolve) => setTimeout(resolve, 1000));
  }

  const relatedMeals = meals
    .filter((meal) => meal.idMeal !== currentMealId)
    .slice(0, 4);

  return (
    <section aria-label={`More from ${category}`} className="mt-12">
      <h2 className="mb-6 text-2xl font-bold text-zinc-950">
        More from {category}
      </h2>
      {relatedMeals.length === 0 ? (
        <p className="text-zinc-600">No other recipes found in this category.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {relatedMeals.map((relatedMeal) => (
            <Link
              key={relatedMeal.idMeal}
              href={`/meal/${relatedMeal.idMeal}`}
              className="group overflow-hidden rounded-xl border border-zinc-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative aspect-square overflow-hidden bg-zinc-100">
                <Image
                  src={relatedMeal.strMealThumb}
                  alt={relatedMeal.strMeal}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="p-3 text-sm font-semibold text-zinc-950">
                {relatedMeal.strMeal}
              </h3>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

async function MealContent({ params }: MealPageProps) {
  const [{ id }, cookieStore] = await Promise.all([params, cookies()]);
  const meal = await getMeal(id);

  if (!meal) {
    notFound();
  }

  const favourites = parseFavourites(
    cookieStore.get(FAVOURITES_COOKIE)?.value,
  );
  const tags = meal.strTags
    ?.split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  const steps = meal.strInstructions
    .split(/\r?\n/)
    .map((step) => step.trim())
    .filter(Boolean);
  const youtubeEmbedUrl = meal.strYoutube
    ? getYoutubeEmbedUrl(meal.strYoutube)
    : null;

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12">
      <Link
        href={`/category/${encodeURIComponent(meal.strCategory)}`}
        className="text-sm font-semibold text-amber-700 hover:text-amber-900"
      >
        &larr; {meal.strCategory}
      </Link>

      <article className="mt-4">
        <header>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <h1 className="text-4xl font-bold text-zinc-950">
              {meal.strMeal}
            </h1>
            <FavouriteButton
              mealId={meal.idMeal}
              initialFavourite={favourites.ids.includes(meal.idMeal)}
              initialMessage={favourites.issue}
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm text-zinc-600">
            <span>{meal.strArea}</span>
            <span aria-hidden="true">&middot;</span>
            <Link
              href={`/category/${encodeURIComponent(meal.strCategory)}`}
              className="font-medium text-amber-700 hover:text-amber-900"
            >
              {meal.strCategory}
            </Link>
          </div>
          {tags && tags.length > 0 && (
            <ul aria-label="Recipe tags" className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <li
                  key={`${tag}-${index}`}
                  className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </header>

        <div className="mt-8 grid gap-8 md:grid-cols-[2fr_1fr]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-100">
            <Image
              src={meal.strMealThumb}
              alt={meal.strMeal}
              fill
              sizes="(max-width: 768px) 100vw, 66vw"
              className="object-cover"
              priority
            />
          </div>

          <aside className="rounded-2xl border border-zinc-200 p-6">
            <h2 className="text-xl font-semibold text-zinc-950">
              Ingredients
            </h2>
            <IngredientsChecklist ingredients={meal.ingredients} />
          </aside>
        </div>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-zinc-950">Instructions</h2>
          <ol className="mt-4 space-y-4">
            {steps.map((step, index) => (
              <li
                key={`${index}-${step.slice(0, 24)}`}
                className="flex gap-4 leading-7 text-zinc-700"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-900">
                  {index + 1}
                </span>
                <p className="pt-0.5">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        {youtubeEmbedUrl && (
          <section className="mt-10">
            <h2 className="mb-4 text-2xl font-semibold text-zinc-950">
              Watch the recipe
            </h2>
            <div className="aspect-video overflow-hidden rounded-2xl bg-zinc-100">
              <iframe
                src={youtubeEmbedUrl}
                title={`${meal.strMeal} video`}
                className="size-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </section>
        )}

        <Suspense fallback={<MoreFromCategorySkeleton />}>
          <MoreFromCategory
            category={meal.strCategory}
            currentMealId={meal.idMeal}
          />
        </Suspense>
      </article>
    </main>
  );
}

export default function MealPage({ params }: MealPageProps) {
  return (
    <Suspense fallback={<MealLoading />}>
      <MealContent params={params} />
    </Suspense>
  );
}
