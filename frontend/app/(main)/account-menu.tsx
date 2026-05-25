"use client";

import { User } from "@/types/user.types";

interface AccountMenuProps {
  user: User;
}

const AccountMenu = ({ user }: AccountMenuProps) => {
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        localStorage.removeItem("authToken");
        window.location.href = "/sign-in";
      }
    } catch (error) {
      console.error("An error occurred while logging out:", error);
    }
  };

  return (
    <div className="flex items-center justify-between gap-1 p-2 hover:bg-neutral-100 cursor-pointer transition-colors rounded-lg group">
      {/* Left Side: User Info */}
      <div className="flex min-w-0 items-center gap-1">
        <img
          src="/userpp.jpeg"
          alt="User Profile"
          className="h-10 w-10 shrink-0 flex-none mr-2 rounded-full object-cover"
        />
        <div className="flex min-w-0 flex-col">
          <span className="font-semibold text-sm">
            {user?.firstName} {user?.lastName}
          </span>
          <span className="max-w-48 truncate text-xs text-neutral-500">
            {user?.email}
          </span>
        </div>
      </div>

      {/* Right Side: Logout Button */}
      <button
        type="button"
        onClick={handleLogout}
        className="shrink-0 p-2 hover:bg-neutral-200 rounded-md transition-colors text-neutral-500 hover:text-red-600"
        title="Logout"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      </button>
    </div>
  );
};

export default AccountMenu;
