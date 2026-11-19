"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
} from "react";
import type { SearchResult } from "@/lib/search-types";

type SearchResponse = {
  results: SearchResult[];
};

function getSearchHref(query: string) {
  return `/search?q=${encodeURIComponent(query)}`;
}

export default function HeaderSearch() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const normalizedQuery = query.trim();
  const visibleResults = results.slice(0, 6);
  const showDropdown = isFocused && normalizedQuery.length >= 2;

  useEffect(() => {
    if (normalizedQuery.length < 2) {
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(normalizedQuery)}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error(`Autocomplete request failed (${response.status})`);
        }

        const payload = (await response.json()) as Partial<SearchResponse>;
        if (!Array.isArray(payload.results)) {
          throw new Error("Autocomplete response was invalid.");
        }

        setResults(payload.results);
        setActiveIndex(-1);
      } catch {
        if (!controller.signal.aborted) {
          setResults([]);
          setError("Suggestions are temporarily unavailable.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [normalizedQuery]);

  function navigateToSearch() {
    if (normalizedQuery.length < 2) {
      return;
    }

    setIsFocused(false);
    router.push(getSearchHref(normalizedQuery));
  }

  function selectResult(result: SearchResult) {
    setIsFocused(false);
    setQuery("");
    router.push(`/meal/${result.id}`);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigateToSearch();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" && visibleResults.length > 0) {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % visibleResults.length);
    } else if (event.key === "ArrowUp" && visibleResults.length > 0) {
      event.preventDefault();
      setActiveIndex((index) =>
        index <= 0 ? visibleResults.length - 1 : index - 1,
      );
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      const activeResult = visibleResults[activeIndex];
      if (activeResult) {
        selectResult(activeResult);
      }
    } else if (event.key === "Escape") {
      setIsFocused(false);
      setActiveIndex(-1);
    }
  }

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (
      !(event.relatedTarget instanceof Node) ||
      !event.currentTarget.contains(event.relatedTarget)
    ) {
      setIsFocused(false);
      setActiveIndex(-1);
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-md"
      onBlur={handleBlur}
    >
      <form onSubmit={handleSubmit} role="search" className="flex">
        <label htmlFor="header-recipe-search" className="sr-only">
          Search recipes
        </label>
        <input
          id="header-recipe-search"
          type="search"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showDropdown}
          aria-controls={showDropdown ? "header-search-results" : undefined}
          aria-activedescendant={
            activeIndex >= 0
              ? `header-search-result-${activeIndex}`
              : undefined
          }
          autoComplete="off"
          value={query}
          onChange={(event) => {
            const nextQuery = event.target.value;
            setQuery(nextQuery);
            setActiveIndex(-1);
            setResults([]);
            setError("");
            setIsLoading(false);
          }}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="Find a recipe..."
          className="min-w-0 flex-1 rounded-l-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
        />
        <button
          type="submit"
          aria-label="Search recipes"
          className="rounded-r-xl bg-amber-600 px-4 text-sm font-semibold text-white transition hover:bg-amber-700"
        >
          Search
        </button>
      </form>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl">
          {isLoading ? (
            <p className="px-4 py-3 text-sm text-zinc-500" role="status">
              Looking for recipes...
            </p>
          ) : error ? (
            <p className="px-4 py-3 text-sm text-red-700" role="status">
              {error}
            </p>
          ) : visibleResults.length > 0 ? (
            <ul id="header-search-results" role="listbox">
              {visibleResults.map((result, index) => (
                <li key={result.id}>
                  <button
                    id={`header-search-result-${index}`}
                    type="button"
                    role="option"
                    aria-selected={activeIndex === index}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => selectResult(result)}
                    className={`flex w-full items-center gap-3 px-3 py-2 text-left transition ${
                      activeIndex === index ? "bg-amber-50" : "hover:bg-zinc-50"
                    }`}
                  >
                    <span className="relative size-10 shrink-0 overflow-hidden rounded-md bg-zinc-100">
                      <Image
                        src={result.thumb}
                        alt=""
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </span>
                    <span className="line-clamp-2 text-sm font-medium text-zinc-900">
                      {result.name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-3 text-sm text-zinc-500" role="status">
              No recipes found.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
