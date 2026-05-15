import { motion } from "framer-motion";
import { Feather, PenLine, Sparkles } from "lucide-react";

export default function WelcomeGraphic() {
  return (
    <div className="relative flex flex-col items-start justify-center text-zinc-900 dark:text-white transition-colors">
      {/* Ambient glow */}
      <motion.div
        className="absolute -z-10 h-96 w-96 rounded-full bg-zinc-300/40 dark:bg-zinc-700/20 blur-3xl"
        animate={{
          scale: [1, 1.08, 1],
          x: [0, 20, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Icon cluster */}
      <div className="mb-6 flex items-center gap-3 text-zinc-500 dark:text-zinc-400">
        <motion.div
          animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Feather size={18} />
        </motion.div>

        <motion.div
          animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3.5, repeat: Infinity }}
        >
          <PenLine size={18} />
        </motion.div>

        <motion.div
          animate={{ y: [0, -5, 0], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Sparkles size={18} />
        </motion.div>
      </div>

      {/* Title */}
      <motion.h1
        className="text-7xl font-semibold tracking-tight text-zinc-900 dark:text-white"
        initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8 }}
      >
        Inkwell
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="mt-5 max-w-md text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.7 }}
      >
        A quiet social platform for meaningful expression. Share thoughts,
        stories, and moments without the noise.
      </motion.p>

      {/* Animated line */}
      <motion.div
        className="mt-8 h-px bg-zinc-400 dark:bg-zinc-600"
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: 176, opacity: 1 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
      />

      {/* Floating dots */}
      <div className="mt-10 flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-2 w-2 rounded-full bg-zinc-500 dark:bg-zinc-400"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              delay: i * 0.25,
            }}
          />
        ))}
      </div>
    </div>
  );
}
