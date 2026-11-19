"use client";

import { useEffect } from "react";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      role="alert"
      className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 py-16 text-center"
    >
      <h1 className="text-3xl font-bold text-zinc-950">
        Something went wrong
      </h1>
      <p className="mt-3 text-zinc-600">
        We couldn&apos;t load this page. Please try again.
      </p>
      <button
        type="button"
        onClick={() => retry()}
        className="mt-6 rounded-full bg-amber-600 px-5 py-3 font-semibold text-white transition hover:bg-amber-700"
      >
        Try again
      </button>
    </main>
  );
}
