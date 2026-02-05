import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export const SignupPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // allow cookies
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Signup failed. Try different credentials.");
      }

      const user = await res.json();
      console.log("New user:", user);

      // After signup, send to dashboard or login
      navigate("/home");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="text-3xl font-bold text-center">
            Create your account ✒️
          </h2>
          <p className="text-center opacity-70 mb-4">
            Join INKWELL and start creating
          </p>

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Username */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                type="text"
                name="username"
                placeholder="coolwriter"
                className="input input-bordered w-full"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                className="input input-bordered w-full"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                className="input input-bordered w-full"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Error */}
            {error && <div className="alert alert-error text-sm">{error}</div>}

            {/* Submit */}
            <button
              type="submit"
              className={`btn btn-primary w-full ${loading ? "btn-disabled" : ""}`}
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <div className="divider">Already have an account?</div>

          <Link to="/login" className="btn btn-outline w-full">
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
};
