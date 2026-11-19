"use client";

import { useState } from "react";
import type { Ingredient } from "@/lib/mealdb";

export default function IngredientsChecklist({
  ingredients,
}: {
  ingredients: Ingredient[];
}) {
  const [checkedIngredients, setCheckedIngredients] = useState<boolean[]>(
    () => ingredients.map(() => false),
  );

  function toggleIngredient(index: number) {
    setCheckedIngredients((checked) =>
      checked.map((isChecked, itemIndex) =>
        itemIndex === index ? !isChecked : isChecked,
      ),
    );
  }

  return (
    <ul className="mt-4 space-y-3">
      {ingredients.map(({ ingredient, measure }, index) => (
        <li key={`${ingredient}-${index}`}>
          <label
            htmlFor={`ingredient-${index}`}
            className="flex cursor-pointer items-start gap-3 text-sm text-zinc-700"
          >
            <input
              id={`ingredient-${index}`}
              type="checkbox"
              checked={checkedIngredients[index]}
              onChange={() => toggleIngredient(index)}
              className="mt-0.5 size-4 shrink-0 accent-amber-600"
            />
            <span
              className={
                checkedIngredients[index] ? "text-zinc-400 line-through" : ""
              }
            >
              {measure ? `${measure} ` : ""}
              {ingredient}
            </span>
          </label>
        </li>
      ))}
    </ul>
  );
}
