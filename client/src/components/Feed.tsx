import { type IUser } from "../types/user";

interface FeedProps {
  user: IUser;
}

export default function Feed({ user }: FeedProps) {
  return (
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
  );
}
