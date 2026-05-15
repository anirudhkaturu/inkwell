import AuthComponent from "../components/AuthComponent";
import WelcomeGraphic from "../components/WelcomeGraphic";
import ThemeToggle from "../components/ThemeToggle";

export default function Landing() {
  return (
    <div className="min-h-screen flex">
      {/* ThemeToggle stays global */}
      <ThemeToggle />

      <div className="hidden md:flex flex-1 items-center justify-center border-r border-zinc-200 dark:border-zinc-800 p-10">
        <WelcomeGraphic />
      </div>

      <div className="flex flex-1 items-center justify-center p-6">
        <AuthComponent />
      </div>
    </div>
  );
}