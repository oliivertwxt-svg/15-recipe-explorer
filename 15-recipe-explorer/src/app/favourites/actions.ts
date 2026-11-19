"use server";

import { cookies } from "next/headers";
import {
  FAVOURITES_COOKIE,
  isMealId,
  MAX_FAVOURITES,
  parseFavourites,
} from "@/lib/favourites";

type ToggleFavouriteResult = {
  favourite: boolean;
  error?: string;
  message?: string;
};

export async function toggleFavourite(
  mealId: string,
): Promise<ToggleFavouriteResult> {
  if (!isMealId(mealId)) {
    return { favourite: false, error: "That recipe ID is invalid." };
  }

  const cookieStore = await cookies();
  const parsed = parseFavourites(
    cookieStore.get(FAVOURITES_COOKIE)?.value,
  );
  const ids = parsed.ids;
  const existingIndex = ids.indexOf(mealId);

  if (existingIndex >= 0) {
    ids.splice(existingIndex, 1);
  } else {
    if (ids.length >= MAX_FAVOURITES) {
      return {
        favourite: false,
        error: `You can save up to ${MAX_FAVOURITES} recipes.`,
      };
    }
    ids.push(mealId);
  }

  cookieStore.set(FAVOURITES_COOKIE, JSON.stringify(ids), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  return {
    favourite: existingIndex < 0,
    ...(parsed.issue ? { message: parsed.issue } : {}),
  };
}
