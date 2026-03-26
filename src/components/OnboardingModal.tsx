import { useDarkMode } from "@/contexts/DarkModeContext";
import { useEffect, useRef, useState } from "react";

// Minimal Onboarding Modal for first-time users
interface OnboardingModalProps {
  open: boolean;
  onClose: () => void;
}

const OnboardingModal = ({ open, onClose }: OnboardingModalProps) => {
  const { darkMode } = useDarkMode()!;
  const [step, setStep] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const steps = [
    {
      title: "Welcome to the Recipe App!",
      content:
        "Discover, save, and create recipes. Plan meals, track nutrition, and more—all in one place.",
    },
    {
      title: "Personalized Experience",
      content:
        "Sign up to save favorites, create collections, and get AI-powered recommendations tailored to you.",
    },
    {
      title: "Explore Features",
      content:
        "Try step-by-step cooking mode, generate shopping lists, and plan your meals with the calendar.",
    },
  ];

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
        aria-labelledby="onboarding-title"
        aria-describedby="onboarding-description"
        className={`max-w-md w-full rounded-xl shadow-lg border p-8 relative ${
          darkMode
            ? "bg-black border-gray-700 text-stone-100"
            : "bg-white border-stone-200 text-stone-900"
        }`}
      >
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-3 right-3 text-stone-400 hover:text-orange-500 text-xl font-bold"
          aria-label="Close onboarding"
          type="button"
        >
          ×
        </button>
        <h2
          id="onboarding-title"
          className="text-2xl font-bold mb-3 bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent"
        >
          {steps[step].title}
        </h2>
        <p id="onboarding-description" className="mb-6 text-base leading-relaxed">
          {steps[step].content}
        </p>
        <div className="flex gap-2 justify-end">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="px-4 py-2 rounded bg-stone-200 hover:bg-stone-300 text-stone-900 font-medium"
            >
              Back
            </button>
          )}
          {step < steps.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="px-4 py-2 rounded bg-orange-700 hover:bg-orange-800 text-white font-medium"
            >
              Next
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded bg-orange-700 hover:bg-orange-800 text-white font-medium"
            >
              Get Started
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;

