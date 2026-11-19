import "server-only";

const API_BASE = "https://www.themealdb.com/api/json/v1/1";

export type Category = {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
};

export type MealSummary = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
};

export type Ingredient = {
  ingredient: string;
  measure: string;
};

export type Meal = MealSummary & {
  strDrinkAlternate: string | null;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strTags: string | null;
  strYoutube: string;
  ingredients: Ingredient[];
};

type MealApiResponse = Record<string, string | null> & {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
};

async function fetchJson<T>(url: string, revalidate: number): Promise<T> {
  const response = await fetch(url, { next: { revalidate } });

  if (!response.ok) {
    throw new Error(`TheMealDB request failed (${response.status})`);
  }

  return response.json() as Promise<T>;
}

function normalizeMeal(meal: MealApiResponse): Meal {
  const ingredients: Ingredient[] = [];

  for (let index = 1; index <= 20; index += 1) {
    const ingredient = meal[`strIngredient${index}`]?.trim();

    if (ingredient) {
      ingredients.push({
        ingredient,
        measure: meal[`strMeasure${index}`]?.trim() || "",
      });
    }
  }

  return {
    idMeal: meal.idMeal,
    strMeal: meal.strMeal,
    strMealThumb: meal.strMealThumb,
    strDrinkAlternate: meal.strDrinkAlternate,
    strCategory: meal.strCategory || "",
    strArea: meal.strArea || "",
    strInstructions: meal.strInstructions || "",
    strTags: meal.strTags,
    strYoutube: meal.strYoutube || "",
    ingredients,
  };
}

export async function getCategories(): Promise<Category[]> {
  const data = await fetchJson<{ categories: Category[] }>(
    `${API_BASE}/categories.php`,
    86400,
  );

  return data.categories ?? [];
}

export async function getMealsByCategory(
  category: string,
): Promise<MealSummary[]> {
  const data = await fetchJson<{ meals: MealSummary[] | null }>(
    `${API_BASE}/filter.php?c=${encodeURIComponent(category)}`,
    3600,
  );

  return data.meals ?? [];
}

export async function searchMeals(query: string): Promise<Meal[]> {
  if (!query.trim()) {
    return [];
  }

  const data = await fetchJson<{ meals: MealApiResponse[] | null }>(
    `${API_BASE}/search.php?s=${encodeURIComponent(query.trim())}`,
    3600,
  );

  return (data.meals ?? []).map(normalizeMeal);
}

export async function getMeal(id: string): Promise<Meal | null> {
  const data = await fetchJson<{ meals: MealApiResponse[] | null }>(
    `${API_BASE}/lookup.php?i=${encodeURIComponent(id)}`,
    3600,
  );

  const meal = data.meals?.[0];
  return meal ? normalizeMeal(meal) : null;
}

export async function getRandomMeal(): Promise<Meal | null> {
  const data = await fetchJson<{ meals: MealApiResponse[] | null }>(
    `${API_BASE}/random.php`,
    0,
  );

  const meal = data.meals?.[0];
  return meal ? normalizeMeal(meal) : null;
}
