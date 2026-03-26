import { useDarkMode } from "@/contexts/DarkModeContext";
import React, { useEffect, useRef } from "react";
import type { NewCollection } from "@/components/RecipeCollections";

interface CreateCollectionModalProps {
  showModal: boolean;
  newCollection: NewCollection;
  setNewCollection: React.Dispatch<React.SetStateAction<NewCollection>>;
  collectionCategories: string[];
  onCreate: () => void;
  onClose: () => void;
}

const CreateCollectionModal: React.FC<CreateCollectionModalProps> = ({
  showModal,
  newCollection,
  setNewCollection,
  collectionCategories,
  onCreate,
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
        aria-labelledby="create-collection-title"
        aria-describedby="create-collection-description"
        className={`w-full max-w-md p-6 rounded-lg ${
          darkMode ? "bg-neutral-900" : "bg-white"
        }`}
      >
        <h3 id="create-collection-title" className="text-lg font-semibold mb-4">
          Create New Collection
        </h3>
        <p id="create-collection-description" className="sr-only">
          Create a new recipe collection with name, description, and category.
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={newCollection.name}
              onChange={(e) =>
                setNewCollection({ ...newCollection, name: e.target.value })
              }
              className={`w-full p-2 border rounded ${
                darkMode
                  ? "bg-neutral-800 border-neutral-700 text-white"
                  : "bg-white border-gray-300"
              }`}
              placeholder="Collection name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={newCollection.description}
              onChange={(e) =>
                setNewCollection({
                  ...newCollection,
                  description: e.target.value,
                })
              }
              className={`w-full p-2 border rounded ${
                darkMode
                  ? "bg-neutral-800 border-neutral-700 text-white"
                  : "bg-white border-gray-300"
              }`}
              placeholder="Collection description"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={newCollection.category}
              onChange={(e) =>
                setNewCollection({
                  ...newCollection,
                  category: e.target.value,
                })
              }
              className={`w-full p-2 border rounded ${
                darkMode
                  ? "bg-neutral-800 border-neutral-700 text-white"
                  : "bg-white border-gray-300"
              }`}
            >
              <option value="">Select a category</option>
              {collectionCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
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
          <button
            onClick={onCreate}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCollectionModal;
