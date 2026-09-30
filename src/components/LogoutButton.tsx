"use client";
import { signOut } from "next-auth/react";
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: "/" })} 
      className="flex items-center justify-center w-full bg-white/10 text-white p-3 rounded-lg hover:bg-black transition-all font-semibold gap-3"
    >
      <LogOut size={20} />
      <span>Logout</span>
    </button>
  );
}