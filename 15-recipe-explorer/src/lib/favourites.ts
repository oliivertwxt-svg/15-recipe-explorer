import "server-only";

export const FAVOURITES_COOKIE = "recipe-favourites";
export const MAX_FAVOURITES = 50;

export type ParsedFavourites = {
  ids: string[];
  issue: string | null;
};

export function isMealId(value: unknown): value is string {
  return typeof value === "string" && /^\d{1,12}$/.test(value);
}

export function parseFavourites(value?: string): ParsedFavourites {
  if (value === undefined) {
    return { ids: [], issue: null };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    return {
      ids: [],
      issue: "Saved favourites were unreadable and will be reset on your next save.",
    };
  }

  if (!Array.isArray(parsed) || parsed.length > MAX_FAVOURITES) {
    return {
      ids: [],
      issue: "Saved favourites were invalid and will be reset on your next save.",
    };
  }

  const ids: string[] = [];
  for (const id of parsed) {
    if (!isMealId(id)) {
      return {
        ids: [],
        issue:
          "Saved favourites contained invalid recipe IDs and will be reset on your next save.",
      };
    }

    if (!ids.includes(id)) {
      ids.push(id);
    }
  }

  return { ids, issue: null };
}
