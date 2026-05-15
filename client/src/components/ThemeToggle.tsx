import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../hooks/useTheme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.05 }}
      onClick={toggleTheme}
      className="
        fixed right-5 top-5 z-50
        rounded-full
        border border-zinc-300
        bg-white/80
        p-3
        text-zinc-900
        shadow-sm
        backdrop-blur
        transition-colors
        dark:border-zinc-700
        dark:bg-zinc-900/80
        dark:text-white
      "
    >
      {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
    </motion.button>
  );
}
