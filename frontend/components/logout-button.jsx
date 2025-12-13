"use client";
import { API_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function LogoutButton({ className = "" }) {
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      // Call backend logout endpoint (GET /user/logout)
      const res = await fetch(`${API_URL}/user/logout`, {
        method: "GET",
        credentials: "include",
      });
      // Remove tokenUser and cartId cookies (client-side, fallback)
      document.cookie = "tokenUser=; Max-Age=0; path=/;";
      document.cookie = "cartId=; Max-Age=0; path=/;";
      // Reload or redirect to home/login
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={cn("hover:cursor-pointer", className)}
    >
      Log out
    </button>
  );
}
