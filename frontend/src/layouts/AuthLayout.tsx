import { Link, Outlet, useLocation } from "react-router-dom";

const AUTH_LINKS = [
  { to: "/sign-in", label: "Sign In" },
  { to: "/sign-up", label: "Sign Up" },
];

const AuthLayout = () => {
  const location = useLocation();

  const links = AUTH_LINKS.map((link) => {
    const style =
      location.pathname === link.to
        ? "text-black"
        : "text-neutral-400 hover:text-black";

    return (
      <Link className={`font-medium tracking-tight ${style}`} to={link.to}>
        {link.label}
      </Link>
    );
  });

  return (
    <div className="flex flex-col min-h-screen items-center p-5 justify-center bg-white/50 bg-[linear-gradient(#f9f9f9_1px,transparent_1px),linear-gradient(to_right,#f9f9f9_1px,#ffffff_1px)] bg-size-[54px_54px]">
      {/* Sign In & Sign Up Switch */}
      <div className="flex gap-5 p-2.5 w-115 border-t border-l border-r border-neutral-200 bg-white">
        {links}
      </div>
      {/* Inner Form */}
      <Outlet />
    </div>
  );
};

export default AuthLayout;
