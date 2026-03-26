import { useDarkMode } from "@/contexts/DarkModeContext";
import React, { useEffect, useRef } from "react";
import type { Recipe } from "@/components/RecipeCollections";

interface AddRecipeModalProps {
  showModal: boolean;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  availableRecipes: Recipe[];
  onAddRecipe: (r: Recipe) => void;
  onClose: () => void;
}

const AddRecipeModal: React.FC<AddRecipeModalProps> = ({
  showModal,
  searchTerm,
  setSearchTerm,
  availableRecipes,
  onAddRecipe,
  onClose,
}) => {
  const { darkMode } = useDarkMode()!;
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!showModal) return;
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const getFocusable = () => {
      const root = dialogRef.current;
      if (!root) return [] as HTMLElement[];
      return Array.from(
        root.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => !el.hasAttribute("disabled"));
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = getFocusable();
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = originalOverflow;
      previouslyFocusedRef.current?.focus();
    };
  }, [showModal, onClose]);

  if (!showModal) return null;

  const filteredRecipes = availableRecipes.filter((recipe) =>
    recipe.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-recipe-title"
        aria-describedby="add-recipe-description"
        className={`w-full max-w-md p-6 rounded-lg ${
          darkMode ? "bg-neutral-900" : "bg-white"
        }`}
      >
        <h3 id="add-recipe-title" className="text-lg font-semibold mb-4">
          Add Recipe to Collection
        </h3>
        <p id="add-recipe-description" className="sr-only">
          Search and add a recipe to the selected collection.
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Search Recipes
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full p-2 border rounded ${
                darkMode
                  ? "bg-neutral-800 border-neutral-700 text-white"
                  : "bg-white border-gray-300"
              }`}
              placeholder="Search your recipes..."
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className={`p-3 border rounded mb-2 cursor-pointer hover:bg-gray-50 ${
                  darkMode
                    ? "border-neutral-700 hover:bg-neutral-700"
                    : "border-gray-200"
                }`}
                onClick={() => onAddRecipe(recipe)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onAddRecipe(recipe);
                  }
                }}
              >
                <div className="font-medium">
                  {recipe.name || (recipe.recipeName as string)}
                </div>
                <div
                  className={`text-sm ${
                    darkMode ? "text-stone-400" : "text-gray-600"
                  }`}
                >
                  {recipe.category || (recipe.recipeCategory as string)}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className={`px-4 py-2 rounded ${
              darkMode
                ? "bg-neutral-700 hover:bg-neutral-600"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            type="button"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRecipeModal;
