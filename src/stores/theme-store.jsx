import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const themeDefinitions = {
  dark: {
    id: "dark",
    label: "Dark Theme",
    className: "theme-dark",
  },
  light: {
    id: "light",
    label: "Light Theme",
    className: "theme-light",
  },
};

const useThemeStore = create(
  persist(
    (set) => ({
      theme: "dark",
      themeDefinitions,
      setTheme: (newTheme) => set({ theme: newTheme }),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "dark" ? "light" : "dark",
        })),
    }),
    {
      name: "themeState",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useThemeStore;
export { themeDefinitions };
