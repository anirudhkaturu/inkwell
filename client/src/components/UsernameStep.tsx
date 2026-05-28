import React from "react";
import { motion } from "framer-motion";
import { User, ArrowRight } from "lucide-react";

interface UsernameStepProps {
  username: string;
  setUsername: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  slideAnimation: Record<string, unknown>;
}

export default function UsernameStep({
  username,
  setUsername,
  onSubmit,
  loading,
  slideAnimation,
}: UsernameStepProps) {
  return (
    <motion.form
      key="username-step"
      onSubmit={onSubmit}
      {...slideAnimation}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
          Secure your identity
        </h2>
        <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
          Pick a unique handle to get started on Inkwell.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Username
        </label>
        <div className="relative flex items-center">
          <span className="absolute left-4 text-zinc-400 dark:text-zinc-500 select-none">
            @
          </span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value.replace(/\s+/g, ""))}
            placeholder="username"
            required
            maxLength={24}
            disabled={loading}
            className="w-full rounded-2xl border border-zinc-200 bg-transparent pl-9 pr-10 py-3 text-zinc-900 outline-none transition focus:border-zinc-900 dark:border-zinc-800 dark:text-white dark:focus:border-white disabled:opacity-50"
          />
          <div className="absolute right-4 text-zinc-400">
            <User size={16} />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !username.trim()}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-900 py-3 font-medium text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {loading ? "Checking..." : "Continue"}
        <ArrowRight size={16} />
      </button>
    </motion.form>
  );
}
