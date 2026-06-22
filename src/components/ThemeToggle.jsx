import useThemeStore from "../stores/theme-store";

function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <div className="w-9/11 flex items-center justify-between rounded-2xl">
      <div>
        <p className="font-bold">Theme</p>
        <p className="text-sm text-muted">
          {theme === "dark" ? "Dark theme is active" : "Light theme is active"}
        </p>
      </div>
      <button
        type="button"
        className="btn btn-primary text-text-reverse  w-[150px]"
        onClick={toggleTheme}
      >
        Switch to {theme === "dark" ? "Light" : "Dark"}
      </button>
    </div>
  );
}

export default ThemeToggle;
