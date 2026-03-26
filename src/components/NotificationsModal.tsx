import { useDarkMode } from "@/contexts/DarkModeContext";
import React, { useEffect, useRef, useState } from "react";
import {
  UtensilsCrossed,
  Clock,
  AlertTriangle,
  Lightbulb,
  ShoppingCart,
  BarChart3,
  Bell,
} from "lucide-react";
import { useAuth } from "@/contexts/useAuth";

export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority: string;
}

interface NotificationsModalProps {
  open: boolean;
  onClose: () => void;
}

const iconClass = "w-6 h-6 shrink-0";

const getNotificationIcon = (type: string): React.ReactNode => {
  switch (type) {
    case "meal_prep":
      return <UtensilsCrossed className={iconClass} aria-hidden />;
    case "cooking_timer":
      return <Clock className={iconClass} aria-hidden />;
    case "ingredient_expiry":
      return <AlertTriangle className={iconClass} aria-hidden />;
    case "recipe_suggestion":
      return <Lightbulb className={iconClass} aria-hidden />;
    case "shopping_reminder":
      return <ShoppingCart className={iconClass} aria-hidden />;
    case "nutrition_goal":
      return <BarChart3 className={iconClass} aria-hidden />;
    default:
      return <Bell className={iconClass} aria-hidden />;
  }
};

const NotificationsModal: React.FC<NotificationsModalProps> = ({
  open,
  onClose,
}) => {
  const { darkMode } = useDarkMode()!;
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  // Load notifications from localStorage (same key for demo and real users)
  useEffect(() => {
    if (!open) return;
    if (currentUser) {
      try {
        const saved: Notification[] = JSON.parse(
          localStorage.getItem(`notifications_${currentUser.uid}`) || "[]"
        );
        setNotifications(Array.isArray(saved) ? saved : []);
      } catch {
        setNotifications([]);
      }
    } else {
      setNotifications([]);
    }
  }, [open, currentUser]);

  // Update notificationsCount in context
  useEffect(() => {
    // Note: setNotificationsCount is not available in ModalContext
    // This would need to be implemented if notifications count is needed
  }, [notifications]);

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

  // Mark as read (persist for both demo and real users)
  const markAsRead = (id: number): void => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);
    if (currentUser) {
      localStorage.setItem(
        `notifications_${currentUser.uid}`,
        JSON.stringify(updated)
      );
    }
  };

  // Delete notification (persist for both demo and real users)
  const deleteNotification = (id: number): void => {
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    if (currentUser) {
      localStorage.setItem(
        `notifications_${currentUser.uid}`,
        JSON.stringify(updated)
      );
    }
  };

  if (!open) return null;

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
        aria-labelledby="notifications-title"
        aria-describedby="notifications-description"
        className={`max-w-md w-full rounded-xl shadow-lg border p-6 relative transition-colors duration-300 ${
          darkMode
            ? "bg-neutral-900 border-neutral-700 text-stone-100"
            : "bg-white border-stone-200 text-stone-900"
        }`}
      >
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-3 right-3 text-stone-400 hover:text-orange-500 text-xl font-bold"
          aria-label="Close notifications"
          type="button"
        >
          ×
        </button>
        <h2 id="notifications-title" className="text-xl font-bold mb-4">
          Notifications
        </h2>
        <p id="notifications-description" className="sr-only">
          Review and manage your recent notifications.
        </p>
        <ul className="divide-y divide-stone-200 dark:divide-neutral-700">
          {notifications.length === 0 && (
            <div className="text-stone-400 text-center py-6">
              No notifications.
            </div>
          )}
          {notifications.map((n) => (
            <li key={n.id} className="py-3 flex items-start gap-3">
              <span className="flex-shrink-0 mt-1">
                {getNotificationIcon(n.type)}
              </span>
              <div className="flex-1">
                <div className="font-semibold mb-1 flex items-center gap-2">
                  {n.title}
                  {!n.read && (
                    <span className="ml-2 px-2 py-0.5 rounded bg-green-500 text-white text-xs">
                      New
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500 dark:text-stone-400">
                  {n.message}
                </div>
                <div className="text-xs text-stone-500 mt-1">{n.time}</div>
                <div className="flex gap-2 mt-2">
                  {!n.read && (
                    <button
                      onClick={() => markAsRead(n.id)}
                      className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white text-xs font-medium"
                    >
                      Mark as read
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(n.id)}
                    className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-xs font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NotificationsModal;
