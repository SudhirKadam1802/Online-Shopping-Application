
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = ({ cartCount }) => {
  const { pathname } = useLocation();
  const [user, setUser] = useState(null);
  const isLoginPage = pathname === "/login";

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

    window.addEventListener("storage", loadUser);
    window.addEventListener("auth-changed", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
      window.removeEventListener("auth-changed", loadUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const navLink =
    "rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-200 transition-all duration-300 hover:bg-orange-500/15 hover:text-orange-400";

  return (
    <nav className="sticky top-0 z-50 border-b border-orange-500/20 bg-gradient-to-r from-[#171717] via-[#242424] to-[#171717] shadow-[0_4px_20px_rgba(0,0,0,0.25)]">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link
          to="/"
          className="group flex items-center gap-3"
        >
          <img
            src="/shop-logo-white-transparent.png"
            alt="Online Shopping Logo"
            className="h-12 w-12 object-contain transition-transform duration-300 group-hover:scale-110"
          />

          <span className="text-2xl font-extrabold tracking-tight text-white">
            Online
            <span className="text-orange-400"> Shopping</span>
          </span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-3">

          {!isLoginPage && (
            <Link to="/" className={navLink}>
              Home
            </Link>
          )}

          {!isLoginPage && !user?.isAdmin && (
            <Link
              to="/cart"
              className="flex items-center gap-2 rounded-xl border border-orange-400/20 bg-orange-500/10 px-4 py-2.5 text-sm font-semibold text-orange-300 transition-all duration-300 hover:border-orange-400/50 hover:bg-orange-500/20"
            >
              🛒 Cart

              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-orange-500 px-1.5 text-xs font-bold text-black">
                {cartCount}
              </span>
            </Link>
          )}

          {user && (
            <>
              {user.isAdmin && (
                <Link to="/admin" className={navLink}>
                  Admin
                </Link>
              )}

              {!user.isAdmin && (
                <Link to="/wishlist" className={navLink}>
                   Wishlist
                </Link>
              )}

              <Link to="/orders" className={navLink}>
                 Orders
              </Link>
            </>
          )}

          {!user ? (
            <>
              <Link
                to="/login"
                className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-black shadow-md shadow-orange-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-400 hover:shadow-orange-500/40"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="rounded-xl border border-orange-400/60 px-5 py-2.5 text-sm font-bold text-orange-400 transition-all duration-300 hover:bg-orange-500 hover:text-black"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <div className="rounded-xl border border-gray-600 bg-white/5 px-4 py-2.5 text-sm font-medium text-gray-200">
                 Welcome, <span className="font-bold text-orange-400">{user.name}</span>
              </div>

              <button
                onClick={handleLogout}
                className="rounded-xl border border-red-500/40 bg-red-500/10 px-5 py-2.5 text-sm font-bold text-red-400 transition-all duration-300 hover:bg-red-500 hover:text-white"
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