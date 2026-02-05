import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const App = () => {
  const [backendUp, setBackendUp] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const checkBackend = async () => {
      try {
        const timeout = setTimeout(() => controller.abort(), 3000);

        const res = await fetch("http://localhost:8080", {
          signal: controller.signal,
        });

        clearTimeout(timeout);

        setBackendUp(res.ok);
      } catch {
        setBackendUp(false);
      }
    };

    checkBackend();
  }, []);

  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      {/* NAVBAR */}
      <div className="navbar bg-base-100 shadow-sm px-8">
        <div className="flex-1 text-2xl font-bold tracking-tight">
          ✒️ INKWELL
        </div>

        <div className="flex-none gap-2">
          <button className="btn btn-ghost btn-sm">Docs</button>
          <button className="btn btn-ghost btn-sm">Pricing</button>

          <Link to="/login" className="btn btn-outline btn-sm">
            Login
          </Link>

          <Link to="/signup" className="btn btn-primary btn-sm">
            Sign Up
          </Link>
        </div>
      </div>

      {/* HERO */}
      <div className="hero py-24">
        <div className="hero-content text-center max-w-3xl">
          <div>
            <h1 className="text-5xl font-extrabold leading-tight">
              Write. Create. Publish.
              <span className="block text-primary">All in one place.</span>
            </h1>

            <p className="py-6 text-lg opacity-80">
              INKWELL is your creative workspace for ideas, drafts, and
              publishing — built for writers, thinkers, and builders.
            </p>

            <div className="flex justify-center gap-4 flex-wrap">
              <button className="btn btn-primary btn-lg">Start Writing</button>
              <button className="btn btn-outline btn-lg">Explore</button>

              <Link to="/login" className="btn btn-ghost btn-lg">
                Login
              </Link>

              <Link to="/signup" className="btn btn-secondary btn-lg">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div className="px-8 pb-24">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="card bg-base-100 shadow-md">
            <div className="card-body">
              <h2 className="card-title">⚡ Fast Editor</h2>
              <p>Zero-lag writing experience with autosave and versioning.</p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-md">
            <div className="card-body">
              <h2 className="card-title">🧠 Smart Tools</h2>
              <p>AI-assisted editing, summaries, and idea expansion.</p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-md">
            <div className="card-body">
              <h2 className="card-title">🌍 Publish Anywhere</h2>
              <p>
                Export to blogs, newsletters, and social platforms instantly.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* BACKEND STATUS INDICATOR */}
      <div className="fixed bottom-4 right-4">
        {backendUp === null && (
          <div className="badge badge-warning gap-2 p-4">
            ⏳ Connecting to servers...
          </div>
        )}

        {backendUp === true && (
          <div className="badge badge-success gap-2 p-4">
            🟢 All systems operational
          </div>
        )}

        {backendUp === false && (
          <div className="toast toast-end">
            <div className="alert alert-info shadow-lg max-w-sm">
              <div>
                <span className="font-semibold">
                  INKWELL is in quiet mode ✨
                </span>
                <div className="text-sm opacity-80">
                  We’re doing a little tune-up. You can explore the app, but
                  writing & sync will return shortly.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
