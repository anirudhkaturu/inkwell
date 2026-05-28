import { useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

type Mode = "login" | "signup";

type ApiError = {
  message?: string;
};

// 1. Defined type representing your finalized backend JSON payload schema
type AuthResponse = {
  message: string;
  user: {
    id: number;
    username: string | null;
    onboarding: boolean;
  };
};

export default function AuthComponent() {
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>("login");

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setPhone("");
    setPassword("");
    setError("");
  };

  const switchToSignup = () => {
    resetForm();
    setMode("signup");
  };

  const switchToLogin = () => {
    resetForm();
    setMode("login");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const endpoint =
        mode === "login"
          ? `${BACKEND_URL}/api/auth/login`
          : `${BACKEND_URL}/api/auth/signup`;

      // 2. Added the AuthResponse type generic to capture backend properties
      const response = await axios.post<AuthResponse>(
        endpoint,
        {
          phone: phone.trim(),
          password,
        },
        {
          withCredentials: true, // 🔥 IMPORTANT: sends/receives cookie
        },
      );

      // 3. Extract the onboarding completion state cleanly
      const isOnboardingComplete = response.data.user?.onboarding;

      // 4. Evaluate and redirect to /onboarding if false, otherwise go /home
      if (isOnboardingComplete) {
        navigate("/home");
      } else {
        navigate("/onboarding");
      }
    } catch (err: unknown) {
      const error = err as AxiosError<ApiError>;

      setError(
        error.response?.data?.message ||
          `${mode === "login" ? "Login" : "Signup"} failed`,
      );
    } finally {
      setLoading(false);
    }
  };

  const pageAnimation = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: 0.2 },
  };

  return (
    <div className="w-full max-w-md">
      <div className="overflow-hidden rounded-4xl border border-zinc-200 bg-white p-8 shadow-xl shadow-black/5 dark:border-zinc-800 dark:bg-zinc-900">
        {/* Header */}
        <div className="mb-8">
          <motion.h1
            key={mode}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white"
          >
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </motion.h1>

          <motion.p
            key={`${mode}-subtitle`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.05 }}
            className="mt-2 text-sm text-zinc-500 dark:text-zinc-400"
          >
            {mode === "login"
              ? "Sign in to continue"
              : "Create your new account"}
          </motion.p>
        </div>

        {/* Error */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              key={error}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.form
            key={mode}
            onSubmit={handleSubmit}
            {...pageAnimation}
            className="space-y-5"
          >
            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Phone Number
              </label>

              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+60 12-345 6789"
                autoComplete="tel"
                required
                className="w-full rounded-2xl border border-zinc-300 bg-transparent px-4 py-3 outline-none transition focus:border-zinc-900 dark:border-zinc-700 dark:focus:border-white"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={
                  mode === "signup" ? "Create password" : "Enter password"
                }
                autoComplete={
                  mode === "signup" ? "new-password" : "current-password"
                }
                required
                minLength={6}
                className="w-full rounded-2xl border border-zinc-300 bg-transparent px-4 py-3 outline-none transition focus:border-zinc-900 dark:border-zinc-700 dark:focus:border-white"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-zinc-900 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black"
            >
              {loading
                ? mode === "login"
                  ? "Signing In..."
                  : "Creating Account..."
                : mode === "login"
                  ? "Sign In"
                  : "Sign Up"}
            </button>

            {/* Switch mode */}
            <div className="pt-2 text-center">
              {mode === "login" ? (
                <button
                  type="button"
                  onClick={switchToSignup}
                  className="text-sm text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                >
                  Don't have an account?{" "}
                  <span className="font-medium underline underline-offset-4">
                    Sign Up
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={switchToLogin}
                  className="text-sm text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                >
                  Already have an account?{" "}
                  <span className="font-medium underline underline-offset-4">
                    Sign In
                  </span>
                </button>
              )}
            </div>
          </motion.form>
        </AnimatePresence>
      </div>
    </div>
  );
}
