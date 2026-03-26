import { useDarkMode } from "@/contexts/DarkModeContext";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/useAuth";
import { addNotification } from "@/utils/notificationUtils";

interface QuickAddModalProps {
  open: boolean;
  onClose: () => void;
}

interface ShoppingItem {
  ingredient: string;
  quantity: string;
  unit: string;
  category: string;
  recipes: string[];
  checked: boolean;
  isCustom: boolean;
}

const QuickAddModal: React.FC<QuickAddModalProps> = ({ open, onClose }) => {
  const { darkMode } = useDarkMode()!;
  const { currentUser } = useAuth();
  const [name, setName] = useState<string>("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  if (!open) return null;

  useEffect(() => {
    if (!open) return;
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
  }, [open, onClose]);

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !currentUser) {
      setName("");
      onClose();
      return;
    }

    try {
      // Load existing shopping list from localStorage
      const storageKey = `shoppingList_${currentUser.uid}`;
      const existing = JSON.parse(
        localStorage.getItem(storageKey) || "[]",
      ) as ShoppingItem[];

      // Create new item
      const newItem: ShoppingItem = {
        ingredient: name.trim(),
        quantity: "1",
        unit: "",
        category: "Produce", // Default category
        recipes: ["Quick Add"],
        checked: false,
        isCustom: true,
      };

      // Add to list (avoid duplicates)
      const exists = existing.some(
        (item) =>
          item.ingredient.toLowerCase() === newItem.ingredient.toLowerCase(),
      );
      if (!exists) {
        const updated = [...existing, newItem];
        localStorage.setItem(storageKey, JSON.stringify(updated));
        addNotification(currentUser.uid, {
          type: "shopping_reminder",
          title: "Added to shopping list",
          message: `"${newItem.ingredient}" was added to your shopping list.`,
          priority: "low",
        });
      }

      setName("");
      onClose();
    } catch (error) {
      console.error("Error adding item to shopping list:", error);
      setName("");
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-add-title"
        aria-describedby="quick-add-description"
        className={`max-w-sm w-full rounded-xl shadow-lg border p-6 relative transition-colors duration-300 ${
          darkMode
            ? "bg-neutral-900 border-neutral-700 text-stone-100"
            : "bg-white border-stone-200 text-stone-900"
        }`}
      >
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-3 right-3 text-stone-400 hover:text-orange-500 text-xl font-bold"
          aria-label="Close quick add"
          type="button"
        >
          ×
        </button>
        <h2 id="quick-add-title" className="text-xl font-bold mb-4">
          Quick Add
        </h2>
        <p id="quick-add-description" className="sr-only">
          Add an item to your shopping list.
        </p>
        <form onSubmit={handleAdd}>
          <input
            type="text"
            placeholder="Recipe name..."
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            className={`w-full px-3 py-2 rounded border mb-4 ${
              darkMode
                ? "bg-neutral-800 border-neutral-600"
                : "bg-white border-gray-300"
            }`}
            required
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded font-medium transition-colors ${
                darkMode
                  ? "bg-neutral-700 hover:bg-neutral-600 text-stone-300"
                  : "bg-stone-200 hover:bg-stone-300 text-stone-900"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-medium"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickAddModal;
