import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Moon, Sun } from "lucide-react";
import { setTheme, toggleTheme, THEME } from "../store/themeSlice";
import "./ThemeToggle.css";

function ThemeToggle() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme);

  // Redux → DOM sync
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // System theme → Redux
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applySystemTheme = (isDark) => {
      dispatch(setTheme(isDark ? THEME.DARK : THEME.LIGHT));
    };

    // initial
    applySystemTheme(mediaQuery.matches);

    const handler = (e) => applySystemTheme(e.matches);
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, [dispatch]);

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="theme-toggle"
      aria-label="Toggle Theme"
    >
      {theme === THEME.DARK ? <Sun /> : <Moon />}
    </button>
  );
}

export default ThemeToggle;
