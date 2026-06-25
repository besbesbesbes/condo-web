import useThemeStore from "../stores/theme-store";
import { useTranslation } from "react-i18next";

function ThemeToggle() {
  const { t } = useTranslation();
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <div className="w-9/11 flex items-center justify-between rounded-2xl">
      <div>
        <p className="font-bold">{t("theme")}</p>
        <p className="text-sm">
          {theme === "dark" ? t("darkThemeIsActive") : t("lightThemeIsActive")}
        </p>
      </div>
      <button
        type="button"
        className="btn btn-primary text-text-reverse  w-[150px]"
        onClick={toggleTheme}
      >
        {t("switchTo")} {theme === t("dark") ? t("light") : t("dark")}
      </button>
    </div>
  );
}

export default ThemeToggle;
