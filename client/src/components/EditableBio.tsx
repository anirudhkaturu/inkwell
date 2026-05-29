import { useState } from "react";
import axios from "axios";
import { FileText, Edit2, Loader2 } from "lucide-react";

interface EditableBioProps {
  currentBio: string | null;
  backendUrl: string;
  onUpdateSuccess: (newBio: string) => void;
}

export default function EditableBio({
  currentBio,
  backendUrl,
  onUpdateSuccess,
}: EditableBioProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [input, setInput] = useState(currentBio || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSave = async () => {
    if (input === currentBio) {
      setIsEditing(false);
      return;
    }

    setIsUpdating(true);
    try {
      await axios.put(
        `${backendUrl}/api/profile/bio`,
        { bio: input },
        { withCredentials: true },
      );
      onUpdateSuccess(input);
      setIsEditing(false);
    } catch (err: any) {
      alert(err.response?.data?.message || "Could not rewrite biography text");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-2">
          <FileText size={14} /> Biography
        </label>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <Edit2 size={11} /> Edit
          </button>
        )}
      </div>

      <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/30 p-4 relative group">
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={input}
              disabled={isUpdating}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={3}
              className="w-full bg-transparent border-0 outline-none resize-none text-sm text-zinc-700 dark:text-zinc-300 placeholder-zinc-400"
            />
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setInput(currentBio || "");
                }}
                disabled={isUpdating}
                className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isUpdating}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 dark:bg-white text-xs text-white dark:text-black font-medium hover:opacity-90 transition disabled:opacity-50"
              >
                {isUpdating && <Loader2 size={12} className="animate-spin" />}
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed pr-6">
            {currentBio || "No profile context specified yet."}
          </p>
        )}
      </div>
    </div>
  );
}
