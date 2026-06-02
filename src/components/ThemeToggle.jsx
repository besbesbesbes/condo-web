import useThemeStore from "../stores/theme-store";

function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <div className="flex flex-col items-center gap-2 w-full mt-4">
      <div className="flex items-center justify-between w-full max-w-[320px] p-4 rounded-2xl border border-solid border-surface-muted bg-surface-soft">
        <div>
          <p className="font-bold">Theme</p>
          <p className="text-sm text-muted">
            {theme === "dark"
              ? "Dark theme is active"
              : "Light theme is active"}
          </p>
        </div>
        <button type="button" className="btn btn-accent" onClick={toggleTheme}>
          Switch to {theme === "dark" ? "Light" : "Dark"}
        </button>
      </div>
    </div>
  );
}

export default ThemeToggle;
