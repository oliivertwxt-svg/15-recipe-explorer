import { getRandomMeal } from "@/lib/mealdb";

export async function GET() {
  const meal = await getRandomMeal();

  if (!meal) {
    return Response.json(
      { error: "TheMealDB did not return a random recipe." },
      {
        status: 502,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }

  return Response.json(
    { id: meal.idMeal },
    { headers: { "Cache-Control": "no-store" } },
  );
}
