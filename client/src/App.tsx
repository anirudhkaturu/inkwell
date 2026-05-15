import AppRouter from "./routes/AppRouter";

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-white transition-colors duration-300">
      <AppRouter />
    </div>
  );
}
