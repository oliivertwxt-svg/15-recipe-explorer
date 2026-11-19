"use client";

import {
  useEffect,
  useRef,
  useState,
  useTransition,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";

function getSearchHref(query: string) {
  return query ? `/search?q=${encodeURIComponent(query)}` : "/search";
}

export default function SearchBox({
  initialQuery,
}: {
  initialQuery: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const queryRef = useRef(initialQuery);
  const hasLocalEdit = useRef(false);

  useEffect(() => {
    if (
      hasLocalEdit.current &&
      initialQuery.trim() !== queryRef.current.trim()
    ) {
      return;
    }

    queryRef.current = initialQuery;
    hasLocalEdit.current = false;
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    const normalizedQuery = query.trim();
    if (normalizedQuery === initialQuery.trim()) {
      return;
    }

    debounceTimer.current = setTimeout(() => {
      startTransition(() => {
        router.replace(getSearchHref(normalizedQuery), { scroll: false });
      });
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [initialQuery, query, router]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    startTransition(() => {
      router.replace(getSearchHref(query.trim()), { scroll: false });
    });
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 sm:flex-row"
        role="search"
      >
        <label className="sr-only" htmlFor="recipe-search">
          Search recipes
        </label>
        <input
          id="recipe-search"
          type="search"
          value={query}
          onChange={(event) => {
            const nextQuery = event.target.value;
            queryRef.current = nextQuery;
            hasLocalEdit.current =
              nextQuery.trim() !== initialQuery.trim();
            setQuery(nextQuery);
          }}
          placeholder="Search by recipe name..."
          className="min-w-0 flex-1 rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
        />
        <button
          type="submit"
          className="rounded-xl bg-amber-600 px-6 py-3 font-semibold text-white transition hover:bg-amber-700"
        >
          Search
        </button>
      </form>
      <p className="mt-2 min-h-5 text-sm text-zinc-500" aria-live="polite">
        {isPending ? "Updating results..." : "Results update as you type."}
      </p>
    </div>
  );
}
