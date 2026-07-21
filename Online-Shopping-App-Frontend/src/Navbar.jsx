import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = ({ cartCount }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };

    loadUser();

    // Update navbar whenever localStorage changes
    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Reload application
    window.location.href = "/login";
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-violet-400 via-purple-500 to-fuchsia-400 shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold tracking-wide text-white"
        >
          🛍️
          <span>Online Shopping</span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-5">
          <Link
            to="/"
            className="rounded-lg px-4 py-2 text-white transition-all duration-300 hover:bg-white/10 hover:text-purple-100"
          >
            Home
          </Link>

          <Link
            to="/cart"
            className="flex items-center gap-2 rounded-full bg-white/20 px-5 py-2.5 font-semibold text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/30"
          >
            🛒 Cart

            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-bold text-purple-600">
              {cartCount}
            </span>
          </Link>

          {!user ? (
            <>
              <Link
                to="/login"
                className="rounded-lg bg-white px-4 py-2 font-semibold text-purple-600 transition hover:bg-purple-100"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="rounded-lg border border-white px-4 py-2 font-semibold text-white transition hover:bg-white hover:text-purple-600"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <div className="rounded-full bg-white/20 px-4 py-2 font-semibold text-white">
                👋 Welcome, {user.name}
              </div>

              <button
                onClick={handleLogout}
                className="rounded-lg bg-red-500 px-4 py-2 font-semibold text-white transition hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;