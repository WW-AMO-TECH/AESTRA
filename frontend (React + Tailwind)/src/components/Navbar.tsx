import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, User, Menu, Search, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const Navbar = () => {
  const { user, loading, logout } = useAuth(); // ✅ FIXED
  const location = useLocation();
  const [sheetOpen, setSheetOpen] = useState(false);

  const isAdmin = user?.role === "admin" || user?.role === "super_admin";

  // ❌ Removed cartCount (we'll reconnect later)
  const cartCount = 0;

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
    { to: "/blog", label: "Blog" },
    { to: "/contact", label: "Contact" },
  ];

  if (loading) return null; // prevents flicker

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="font-display text-lg font-bold tracking-tight flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-black">A</span>
          </div>
          AESTRA-TECH
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === l.to ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden md:flex items-center gap-3">

          <Link to="/products" className="p-2 rounded-lg hover:bg-secondary">
            <Search className="w-5 h-5 text-muted-foreground" />
          </Link>

          <Link to="/cart" className="p-2 rounded-lg hover:bg-secondary relative">
            <ShoppingCart className="w-5 h-5 text-muted-foreground" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <Link
                to={isAdmin ? "/admin/dashboard" : "/dashboard"}
                className="p-2 rounded-lg hover:bg-secondary"
              >
                <User className="w-5 h-5 text-muted-foreground" />
              </Link>

              <button
                onClick={logout}
                className="text-sm text-muted-foreground hover:text-red-500"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-primary-glow text-sm px-4 py-2">
              Login
            </Link>
          )}
        </div>

        {/* MOBILE MENU */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <button className="md:hidden p-2 rounded-lg hover:bg-secondary">
              <Menu className="w-6 h-6" />
            </button>
          </SheetTrigger>

          <SheetContent side="right" className="w-[280px]">
            <SheetHeader className="mb-6">
              <SheetTitle className="flex items-center gap-2">
                <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">A</span>
                </div>
                AESTRA-TECH
              </SheetTitle>
            </SheetHeader>

            <div className="flex flex-col gap-2">
              {navLinks.map(l => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setSheetOpen(false)}
                  className="py-2 px-2 rounded-md hover:bg-gray-200 hover:text-primary"
                >
                  {l.label}
                </Link>
              ))}

              <Link
                to="/cart"
                onClick={() => setSheetOpen(false)}
                className="py-2 px-2 rounded-md hover:bg-gray-200 hover:text-primary flex justify-between"
              >
                Cart
                {cartCount > 0 && <span>{cartCount}</span>}
              </Link>

              <div className="border-t my-3" />

              {user ? (
                <>
                  <Link
                    to={isAdmin ? "/admin/dashboard" : "/dashboard"}
                    onClick={() => setSheetOpen(false)}
                    className="py-2 px-2 rounded-md hover:bg-gray-200 hover:text-primary"
                  >
                    {isAdmin ? "Admin Dashboard" : "Dashboard"}
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setSheetOpen(false);
                    }}
                    className="py-1 px-2 text-left text-primary hover:text-red-500"
                  >
                  <span className="flex items-center gap-2 rounded-xl w-fit">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setSheetOpen(false)}
                  className="btn-primary-glow text-center py-2"
                >
                  Login
                </Link>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;