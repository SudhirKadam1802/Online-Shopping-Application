import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginUser } from "../api";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [transitionDestination, setTransitionDestination] = useState(null);

  useEffect(() => {
    if (!transitionDestination) return undefined;

    const timeoutId = window.setTimeout(() => {
      navigate(transitionDestination, { replace: true });
    }, 2000);

    return () => window.clearTimeout(timeoutId);
  }, [navigate, transitionDestination]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await loginUser(formData);

      localStorage.setItem("token", response.data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );
      window.dispatchEvent(new Event("auth-changed"));

      const returnTo = location.state?.from?.pathname;
      setTransitionDestination(
        response.data.user.isAdmin ? "/admin" : returnTo || "/"
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Invalid Email or Password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative left-1/2 -my-8 flex min-h-[calc(100vh-5rem)] w-screen -translate-x-1/2 items-center justify-center bg-gradient-to-br from-slate-100 via-violet-50 to-purple-100 px-4 py-8">

      <div className="w-full max-w-md rounded-2xl border border-white/70 bg-white/95 p-6 shadow-2xl backdrop-blur-sm">

        {/* Logo */}
        <div className="mb-5 text-center">

          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg shadow-orange-500/20">
            <img
              src="/shop-logo-white-transparent.png"
              alt="Online Shopping logo"
              className="h-10 w-10 object-contain"
            />
          </div>

          <h2 className="text-2xl font-bold text-slate-800">
            Welcome Back
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Login to continue shopping
          </p>

        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-center text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-700 outline-none transition-all duration-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 pr-12 text-slate-700 outline-none transition-all duration-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-violet-600"
              >
                {showPassword ? (
                  <FaEyeSlash size={18} />
                ) : (
                  <FaEye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading || Boolean(transitionDestination)}
            className="mt-2 w-full rounded-lg bg-orange-500 py-2.5 font-bold text-black shadow-lg shadow-orange-500/20 transition-all duration-300 hover:scale-[1.02] hover:bg-orange-400 hover:shadow-orange-500/40 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Logging in..." : transitionDestination ? "Welcome!" : "Login"}
          </button>

        </form>

        {/* Footer */}
        <div className="mt-5 border-t border-slate-200 pt-4 text-center">

          <p className="text-sm text-slate-600">
            Don't have an account?
          </p>

          <Link
            to="/signup"
            className="mt-2 inline-block font-semibold text-violet-600 transition hover:text-fuchsia-600 hover:underline"
          >
            Create Account →
          </Link>

        </div>

      </div>

      {transitionDestination && (
        <div
          className="login-transition-overlay"
          role="status"
          aria-live="polite"
          aria-label="Login successful. Opening your store."
        >
          <div className="login-transition-brand">
            <img
              src="/shop-logo-white-transparent.png"
              alt=""
              className="login-transition-logo"
            />
            <span className="login-transition-name">
              Online<span> Shopping</span>
            </span>
          </div>
        </div>
      )}

    </div>
  );
};

export default Login;