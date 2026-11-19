export default function MealLoading() {
  return (
    <main className="mx-auto w-full max-w-5xl animate-pulse px-6 py-12">
      <div className="h-5 w-32 rounded bg-zinc-200" />
      <div className="mt-5 h-10 w-2/3 rounded bg-zinc-200" />
      <div className="mt-3 h-5 w-48 rounded bg-zinc-200" />
      <div className="mt-8 grid gap-8 md:grid-cols-[2fr_1fr]">
        <div className="aspect-[4/3] rounded-2xl bg-zinc-200" />
        <div className="rounded-2xl border border-zinc-200 p-6">
          <div className="h-7 w-36 rounded bg-zinc-200" />
          <div className="mt-5 space-y-4">
            {Array.from({ length: 7 }, (_, index) => (
              <div key={index} className="h-4 rounded bg-zinc-200" />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-8 h-8 w-40 rounded bg-zinc-200" />
      <div className="mt-4 space-y-3">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="h-4 rounded bg-zinc-200" />
        ))}
      </div>
    </main>
  );
}
