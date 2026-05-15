import { motion } from "framer-motion";
import { Moon, Sparkles, Sun } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

type UserCardProps = {
  username: string;
  fullName?: string;
  bio?: string;
  profilePicture: string;
};

export default function UserCard({
  username,
  fullName,
  bio,
  profilePicture,
}: UserCardProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.5 }}
      className="
        relative overflow-hidden rounded-3xl
        border border-zinc-200 dark:border-zinc-800
        bg-white/80 dark:bg-zinc-900/80
        backdrop-blur-xl
        p-6 shadow-sm
        transition-colors duration-300
      "
    >
      {/* Ambient glow */}
      <motion.div
        className="
          absolute -right-10 -top-10
          h-40 w-40 rounded-full
          bg-zinc-300/40 dark:bg-zinc-700/20
          blur-3xl
        "
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Top section */}
      <div className="relative flex items-start justify-between">
        {/* Left */}
        <div className="flex items-center gap-4">
          {/* Profile picture */}
          <motion.img
            whileHover={{ scale: 1.04 }}
            src={profilePicture}
            alt={username}
            className="
              h-16 w-16 rounded-full
              object-cover
              ring-2 ring-zinc-200 dark:ring-zinc-700
            "
          />

          {/* User info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white">
                @{username}
              </h2>

              <motion.div
                animate={{
                  opacity: [0.4, 1, 0.4],
                  y: [0, -2, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                }}
                className="text-zinc-500 dark:text-zinc-400"
              >
                <Sparkles size={14} />
              </motion.div>
            </div>

            {fullName && (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {fullName}
              </p>
            )}
          </div>
        </div>

        {/* Theme toggle */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.05 }}
          onClick={toggleTheme}
          className="
            rounded-full
            border border-zinc-300 dark:border-zinc-700
            bg-white/70 dark:bg-zinc-800/70
            p-2.5
            text-zinc-900 dark:text-white
            backdrop-blur
            transition-colors
          "
        >
          {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
        </motion.button>
      </div>

      {/* Bio */}
      {bio && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="
            relative mt-5
            text-sm leading-relaxed
            text-zinc-600 dark:text-zinc-400
          "
        >
          {bio}
        </motion.p>
      )}

      {/* Divider */}
      <motion.div
        className="mt-6 h-px bg-zinc-200 dark:bg-zinc-800"
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: "100%", opacity: 1 }}
        transition={{
          delay: 0.2,
          duration: 0.6,
        }}
      />

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-500">
          Logged In
        </span>

        <motion.div
          className="flex gap-1"
          animate={{
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="
                h-1.5 w-1.5 rounded-full
                bg-zinc-500 dark:bg-zinc-400
              "
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
