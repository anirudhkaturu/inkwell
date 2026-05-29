import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Edit2, Check, X, Loader2, Sparkles } from "lucide-react";

interface EditableUsernameProps {
  currentUsername: string | null;
  backendUrl: string;
  onUpdateSuccess: (newUsername: string) => void;
}

export default function EditableUsername({
  currentUsername,
  backendUrl,
  onUpdateSuccess,
}: EditableUsernameProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [input, setInput] = useState(currentUsername || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSave = async () => {
    const trimmed = input.trim();
    if (!trimmed || trimmed === currentUsername) {
      setIsEditing(false);
      return;
    }

    setIsUpdating(true);
    try {
      await axios.put(
        `${backendUrl}/api/profile/username`,
        { username: trimmed },
        { withCredentials: true },
      );
      onUpdateSuccess(trimmed);
      setIsEditing(false);
    } catch (err: any) {
      alert(err.response?.data?.message || "Could not modify identity handle");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isEditing) {
    return (
      <div className="relative flex items-center w-full max-w-xs">
        <span className="absolute left-3 text-sm text-zinc-400 dark:text-zinc-500 select-none">
          @
        </span>
        <input
          type="text"
          value={input}
          disabled={isUpdating}
          maxLength={24}
          onChange={(e) => setInput(e.target.value.replace(/\s+/g, ""))}
          className="w-full rounded-xl border border-zinc-200 bg-transparent pl-7 pr-16 py-1 text-base font-medium text-zinc-900 outline-none transition focus:border-zinc-900 dark:border-zinc-800 dark:text-white dark:focus:border-white disabled:opacity-50"
          autoFocus
        />
        <div className="absolute right-1.5 flex items-center gap-1">
          <button
            onClick={handleSave}
            disabled={isUpdating || !input.trim()}
            className="p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-emerald-600 dark:text-emerald-400 disabled:opacity-40"
          >
            {isUpdating ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Check size={14} />
            )}
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setInput(currentUsername || "");
            }}
            disabled={isUpdating}
            className="p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 group">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
        @{currentUsername || "anonymous"}
      </h1>
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4], y: [0, -1, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="text-zinc-400 dark:text-zinc-500"
      >
        <Sparkles size={14} />
      </motion.div>
      <button
        onClick={() => setIsEditing(true)}
        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all duration-200"
      >
        <Edit2 size={13} />
      </button>
    </div>
  );
}
