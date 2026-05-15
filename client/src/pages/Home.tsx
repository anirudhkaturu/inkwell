import UserCard from "../components/UserCard";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      <div className="mx-auto flex max-w-7xl gap-10 px-6 py-8">
        {/* Feed Section */}
        <main className="flex flex-1 justify-center">
          <div className="w-full max-w-2xl">
            <div
              className="
                rounded-3xl border border-zinc-200
                bg-white p-6 shadow-sm
                dark:border-zinc-800 dark:bg-zinc-900
              "
            >
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
                Home Feed
              </h1>

              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Your feed content will go here.
              </p>
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="hidden w-80 shrink-0 lg:block">
          <div className="sticky top-8">
            <UserCard
              username="johndoe"
              fullName="John Doe"
              bio="Writing quietly into the void."
              profilePicture="https://i.pravatar.cc/150?img=12"
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
