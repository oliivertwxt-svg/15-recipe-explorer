"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function RandomRecipeButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleClick() {
    setError("");

    startTransition(async () => {
      try {
        const response = await fetch("/api/random", { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`Random recipe request failed (${response.status})`);
        }

        const payload = (await response.json()) as { id?: unknown };
        if (typeof payload.id !== "string" || !/^\d{1,12}$/.test(payload.id)) {
          throw new Error("Random recipe response had an invalid ID.");
        }

        router.push(`/meal/${payload.id}`);
      } catch {
        setError("Could not load a random recipe. Please try again.");
      }
    });
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        aria-busy={isPending}
        className="whitespace-nowrap rounded-xl border border-amber-600 px-4 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-50 disabled:cursor-wait disabled:opacity-70"
      >
        {isPending ? "Finding recipe..." : "Surprise me"}
      </button>
      {error && (
        <span className="max-w-48 text-xs text-rose-700" role="status">
          {error}
        </span>
      )}
    </div>
  );
}
