import React from "react";
import { motion } from "framer-motion";
import { FileText, CheckCircle2 } from "lucide-react";

interface BioStepProps {
  bio: string;
  setBio: (value: string) => void;
  onSubmit: (e?: React.FormEvent, isSkipping?: boolean) => void;
  loading: boolean;
  slideAnimation: Record<string, unknown>;
}

export default function BioStep({
  bio,
  setBio,
  onSubmit,
  loading,
  slideAnimation,
}: BioStepProps) {
  return (
    <motion.form
      key="bio-step"
      onSubmit={(e) => onSubmit(e, false)}
      {...slideAnimation}
      className="space-y-6"
    >
      <div>
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
          <CheckCircle2 size={16} />
          <span className="text-xs font-medium tracking-wide uppercase">
            Username locked in
          </span>
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
          Tell us about yourself
        </h2>
        <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
          Write a small introduction for your profile. You can skip this step
          and add it later.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Bio
          </label>
          <span className="text-xs text-zinc-400 dark:text-zinc-500">
            {bio.length}/150
          </span>
        </div>
        <div className="relative">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="A quiet storyteller, penning down expressions..."
            maxLength={150}
            rows={4}
            disabled={loading}
            className="w-full resize-none rounded-2xl border border-zinc-200 bg-transparent px-4 py-3 text-zinc-900 outline-none transition focus:border-zinc-900 dark:border-zinc-800 dark:text-white dark:focus:border-white disabled:opacity-50"
          />
          <div className="absolute bottom-4 right-4 text-zinc-400">
            <FileText size={16} />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-zinc-900 py-3 font-medium text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {loading ? "Finishing up..." : "Complete Profile"}
        </button>

        <button
          type="button"
          onClick={() => onSubmit(undefined, true)}
          disabled={loading}
          className="w-full rounded-2xl bg-transparent py-2.5 text-sm font-medium text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white disabled:opacity-50"
        >
          Skip for now
        </button>
      </div>
    </motion.form>
  );
}
