export default function SearchLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl animate-pulse px-6 py-12">
      <div className="h-4 w-24 rounded bg-zinc-200" />
      <div className="mt-3 h-10 w-64 rounded bg-zinc-200" />
      <div className="mt-6 h-12 w-full max-w-2xl rounded-xl bg-zinc-200" />
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
    </main>
  );
}
