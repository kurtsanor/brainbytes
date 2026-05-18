"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const AUTH_LINKS = [
  { to: "/sign-in", label: "Sign In" },
  { to: "/sign-up", label: "Sign Up" },
];

const AuthNav = () => {
  const pathname = usePathname();
  const links = AUTH_LINKS.map((link) => {
    const style =
      pathname === link.to ? "text-black" : "text-neutral-400 hover:text-black";

    return (
      <Link
        key={link.label}
        className={`font-medium tracking-tight ${style} transition-colors duration-200`}
        href={link.to}
      >
        {link.label}
      </Link>
    );
  });

  return (
    <div className="flex gap-5 p-2.5 w-115 border-t border-l border-r border-neutral-200 bg-white">
      {links}
    </div>
  );
};

export default AuthNav;
