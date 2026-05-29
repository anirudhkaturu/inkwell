import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Calendar, User, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Sub-component architectural dependencies
import EditableUsername from "../components/EditableUsername";
import EditableBio from "../components/EditableBio";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

type UserProfile = {
  id: string;
  username: string | null;
  bio: string | null;
  profilePicture: string | null;
  onboarding: boolean;
  createdAt: string | Date;
};

type ProfileResponse = {
  user?: UserProfile;
} & UserProfile;

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<ProfileResponse>(`${BACKEND_URL}/api/profile/`, {
        withCredentials: true,
      })
      .then((response) => {
        setProfile(response.data.user || response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message || "Failed to load identity profile",
        );
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-400 dark:text-zinc-600" />
          <p className="text-xs tracking-wider uppercase text-zinc-400 dark:text-zinc-500 font-medium animate-pulse">
            Syncing Profile...
          </p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6">
        <div className="w-full max-w-md rounded-4xl border border-red-200 bg-red-50/50 p-6 text-center dark:border-red-950/40 dark:bg-red-950/10">
          <p className="text-sm font-medium text-red-600 dark:text-red-400">
            Error: {error || "Profile data missing"}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> Go Back
          </button>
        </div>
      </div>
    );
  }

  const joinedDate = new Date(profile.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-zinc-50 transition-colors duration-300 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Ambience Deco */}
      <motion.div
        className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-zinc-300/30 dark:bg-zinc-800/20 blur-3xl"
        animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="w-full max-w-xl relative z-10">
        <motion.button
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors group"
        >
          <ArrowLeft
            size={16}
            className="transition-transform group-hover:-translate-x-0.5"
          />
          <span>Back</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.4 }}
          className="overflow-hidden rounded-4xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xl shadow-black/5 dark:border-zinc-800 dark:bg-zinc-900/80 backdrop-blur-xl"
        >
          {/* Header Frame Row */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-5 w-full">
              <motion.img
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                src={
                  profile.profilePicture ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"
                }
                alt={profile.username || "Profile"}
                className="h-20 w-20 rounded-3xl object-cover ring-2 ring-zinc-100 dark:ring-zinc-800 shadow-inner"
              />

              <div className="space-y-1 flex-1">
                {/* Isolated Editable Username Node */}
                <div className="flex items-center gap-2 min-h-8">
                  <EditableUsername
                    currentUsername={profile.username}
                    backendUrl={BACKEND_URL}
                    onUpdateSuccess={(newUsername) =>
                      setProfile((prev) =>
                        prev ? { ...prev, username: newUsername } : null,
                      )
                    }
                  />
                </div>

                {profile.onboarding ? (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    <CheckCircle size={12} /> Verified Identity
                  </span>
                ) : (
                  <span className="text-xs text-zinc-400 dark:text-zinc-500">
                    Setup Unfinished
                  </span>
                )}
              </div>
            </div>
          </div>

          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "100%", opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="mt-6 h-px bg-zinc-200 dark:bg-zinc-800"
          />

          {/* Details & Isolated Biography Segment */}
          <div className="mt-6 space-y-6">
            <EditableBio
              currentBio={profile.bio}
              backendUrl={BACKEND_URL}
              onUpdateSuccess={(newBio) =>
                setProfile((prev) => (prev ? { ...prev, bio: newBio } : null))
              }
            />

            {/* Grid Bottom Info Metadata Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-2">
                  <Calendar size={13} /> Timestamp
                </label>
                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-transparent px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
                  <span className="text-zinc-400 text-xs">Joined</span>
                  <span className="font-medium font-mono text-xs">
                    {joinedDate}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-2">
                  <User size={13} /> Node Registry
                </label>
                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-transparent px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
                  <span className="text-zinc-400 text-xs">Node ID</span>
                  <span className="font-mono text-[11px] truncate max-w-30 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md text-zinc-500 dark:text-zinc-400">
                    {profile.id}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Interface */}
          <div className="mt-8 flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
              Inkwell Core Session
            </span>
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700"
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
