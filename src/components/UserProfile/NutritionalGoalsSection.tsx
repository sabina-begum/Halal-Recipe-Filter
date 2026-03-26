import { useDarkMode } from "@/contexts/DarkModeContext";
interface NutritionalGoalsSectionProps {
  profile: {
    dailyCalories: number;
    proteinGoal: number;
    carbsGoal: number;
    fatGoal: number;
  };
  setProfile: (profile: {
    dailyCalories: number;
    proteinGoal: number;
    carbsGoal: number;
    fatGoal: number;
  }) => void;
  isEditing: boolean;
}

export default function NutritionalGoalsSection({
  profile,
  setProfile,
  isEditing,
}: NutritionalGoalsSectionProps) {
  const { darkMode } = useDarkMode()!;
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Nutritional Goals (Daily)</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label htmlFor="profile-goal-calories" className="block text-sm font-medium mb-2">
            Calories
          </label>
          <input
            id="profile-goal-calories"
            type="number"
            value={profile.dailyCalories}
            onChange={(e) =>
              setProfile({
                ...profile,
                dailyCalories: parseInt(e.target.value),
              })
            }
            disabled={!isEditing}
            className={`w-full px-3 py-2 rounded-lg border ${
              darkMode
                ? "bg-gray-800 border-gray-600 text-gray-100"
                : "bg-white border-gray-300 text-gray-800"
            } ${!isEditing ? "opacity-50" : ""}`}
          />
        </div>
        <div>
          <label htmlFor="profile-goal-protein" className="block text-sm font-medium mb-2">
            Protein (g)
          </label>
          <input
            id="profile-goal-protein"
            type="number"
            value={profile.proteinGoal}
            onChange={(e) =>
              setProfile({
                ...profile,
                proteinGoal: parseInt(e.target.value),
              })
            }
            disabled={!isEditing}
            className={`w-full px-3 py-2 rounded-lg border ${
              darkMode
                ? "bg-gray-800 border-gray-600 text-gray-100"
                : "bg-white border-gray-300 text-gray-800"
            } ${!isEditing ? "opacity-50" : ""}`}
          />
        </div>
        <div>
          <label htmlFor="profile-goal-carbs" className="block text-sm font-medium mb-2">
            Carbs (g)
          </label>
          <input
            id="profile-goal-carbs"
            type="number"
            value={profile.carbsGoal}
            onChange={(e) =>
              setProfile({
                ...profile,
                carbsGoal: parseInt(e.target.value),
              })
            }
            disabled={!isEditing}
            className={`w-full px-3 py-2 rounded-lg border ${
              darkMode
                ? "bg-gray-800 border-gray-600 text-gray-100"
                : "bg-white border-gray-300 text-gray-800"
            } ${!isEditing ? "opacity-50" : ""}`}
          />
        </div>
        <div>
          <label htmlFor="profile-goal-fat" className="block text-sm font-medium mb-2">
            Fat (g)
          </label>
          <input
            id="profile-goal-fat"
            type="number"
            value={profile.fatGoal}
            onChange={(e) =>
              setProfile({
                ...profile,
                fatGoal: parseInt(e.target.value),
              })
            }
            disabled={!isEditing}
            className={`w-full px-3 py-2 rounded-lg border ${
              darkMode
                ? "bg-gray-800 border-gray-600 text-gray-100"
                : "bg-white border-gray-300 text-gray-800"
            } ${!isEditing ? "opacity-50" : ""}`}
          />
        </div>
      </div>
    </div>
  );
}

