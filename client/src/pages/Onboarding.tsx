import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { Feather, PenLine, Sparkles } from "lucide-react";

// Imported Step Components
import UsernameStep from "../components/UsernameStep";
import BioStep from "../components/BioStep";
import ThemeToggle from "../components/ThemeToggle";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

type Step = "username" | "bio";

type ApiError = {
  message?: string;
};

export default function Onboarding() {
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("username");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Submit Username
  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError("");

    try {
      await axios.put(
        `${BACKEND_URL}/api/onboard/username`,
        { username: username.trim().toLowerCase() },
        { withCredentials: true },
      );

      setStep("bio");
    } catch (err: unknown) {
      const axiosError = err as AxiosError<ApiError>;
      setError(
        axiosError.response?.data?.message ||
          "Failed to save username. Try another one.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Submit Bio or Finish Onboarding
  const handleBioSubmit = async (e?: React.FormEvent, isSkipping = false) => {
    if (e) e.preventDefault();

    setLoading(true);
    setError("");

    try {
      if (!isSkipping && bio.trim()) {
        await axios.put(
          `${BACKEND_URL}/api/profile/bio`,
          { bio: bio.trim() },
          { withCredentials: true },
        );
      }

      navigate("/home");
    } catch (err: unknown) {
      const axiosError = err as AxiosError<ApiError>;
      setError(axiosError.response?.data?.message || "Failed to save bio.");
    } finally {
      setLoading(false);
    }
  };

  const slideAnimation = {
    initial: { opacity: 0, x: 15, filter: "blur(4px)" },
    animate: { opacity: 1, x: 0, filter: "blur(0px)" },
    exit: { opacity: 0, x: -15, filter: "blur(4px)" },
    transition: { duration: 0.3, ease: "easeInOut" },
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-zinc-50 px-4 transition-colors duration-300 dark:bg-zinc-950">
      <ThemeToggle />

      {/* Background Ambient Glow */}
      <motion.div
        className="absolute h-120 w-120 rounded-full bg-zinc-200/50 dark:bg-zinc-800/20 blur-3xl"
        animate={{
          scale: [1, 1.05, 1],
          x: [0, 15, 0],
          y: [0, -15, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Main Container Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-zinc-200 bg-white/80 p-8 shadow-xl shadow-black/5 backdrop-blur-xl transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900/80"
      >
        {/* Animated Top Icon Decoration */}
        <div className="mb-6 flex items-center justify-center gap-2.5 text-zinc-400 dark:text-zinc-500">
          <motion.div
            animate={{ y: [0, -3, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Feather size={16} />
          </motion.div>
          <motion.div
            animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 3.5, repeat: Infinity }}
          >
            <PenLine size={16} />
          </motion.div>
          <motion.div
            animate={{ y: [0, -3, 0], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Sparkles size={16} />
          </motion.div>
        </div>

        {/* Dynamic Errors Container */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-5 overflow-hidden rounded-2xl border border-red-200 bg-red-50/50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Onboarding Wizard Routing Switches */}
        <AnimatePresence mode="wait" initial={false}>
          {step === "username" ? (
            <UsernameStep
              username={username}
              setUsername={setUsername}
              onSubmit={handleUsernameSubmit}
              loading={loading}
              slideAnimation={slideAnimation}
            />
          ) : (
            <BioStep
              bio={bio}
              setBio={setBio}
              onSubmit={handleBioSubmit}
              loading={loading}
              slideAnimation={slideAnimation}
            />
          )}
        </AnimatePresence>

        {/* Decorative Progress Dots Indicator at Footer */}
        <div className="mt-8 h-px bg-zinc-100 dark:bg-zinc-800" />
        <div className="mt-4 flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-500">
          <span className="uppercase tracking-widest">
            {step === "username" ? "Step 1 of 2" : "Step 2 of 2"}
          </span>
          <div className="flex gap-1.5">
            <div
              className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                step === "username"
                  ? "w-4 bg-zinc-800 dark:bg-white"
                  : "bg-zinc-200 dark:bg-zinc-700"
              }`}
            />
            <div
              className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                step === "bio"
                  ? "w-4 bg-zinc-800 dark:bg-white"
                  : "bg-zinc-200 dark:bg-zinc-700"
              }`}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
