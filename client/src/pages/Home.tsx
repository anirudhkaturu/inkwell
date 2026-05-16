import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserCard from "../components/UserCard";

import { type IUser } from "../types/user";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function Home() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const { data } = await axios.get(`${BACKEND_URL}/api/auth/me`, {
          withCredentials: true, // sends cookie
        });

        setUser(data.user);
      } catch (err) {
        console.log(err);
        setUser(null)
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <p className="text-zinc-500 dark:text-zinc-400">
          Checking authentication...
        </p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      <div className="mx-auto flex max-w-7xl gap-10 px-6 py-8">
        {/* Feed Section */}
        <main className="flex flex-1 justify-center">
          <div className="w-full max-w-2xl">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
                Home Feed
              </h1>

              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Welcome {user.username}
              </p>
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="hidden w-80 shrink-0 lg:block">
          <div className="sticky top-8">
            <UserCard
              username={user.username || "user"}
              bio="Writing quietly into the void."
              profilePicture={user.profilePicture}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
