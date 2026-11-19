"use client";

import { useOptimistic, useState, useTransition } from "react";
import { toggleFavourite } from "@/app/favourites/actions";

export default function FavouriteButton({
  mealId,
  initialFavourite,
  initialMessage,
}: {
  mealId: string;
  initialFavourite: boolean;
  initialMessage?: string | null;
}) {
  const [favourite, setFavourite] = useOptimistic(initialFavourite);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState(initialMessage ?? "");

  function handleToggle() {
    setMessage("");
    startTransition(async () => {
      setFavourite(!favourite);

      try {
        const result = await toggleFavourite(mealId);
        setMessage(result.error ?? result.message ?? "");
      } catch {
        setMessage("Could not update favourites. Please try again.");
      }
    });
  }

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={handleToggle}
        disabled={isPending}
        aria-pressed={favourite}
        aria-label={
          favourite ? "Remove from favourites" : "Add to favourites"
        }
        aria-busy={isPending}
        className="inline-flex size-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-2xl leading-none text-rose-600 shadow-sm transition hover:bg-rose-50 disabled:cursor-wait disabled:opacity-70"
      >
        <span aria-hidden="true">{favourite ? "♥" : "♡"}</span>
      </button>
      {message && (
        <span className="max-w-64 text-xs text-rose-700" role="status">
          {message}
        </span>
      )}
    </div>
  );
}
