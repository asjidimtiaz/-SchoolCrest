"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useClerk } from "@clerk/nextjs";
import {
  LogOut,
  User,
  Settings,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";

interface SidebarProfileProps {
  admin: {
    name: string;
    email: string;
    avatar_url?: string | null;
  };
  schoolName: string;
  profileLink?: string;
  primaryColor?: string;
  isSuperAdmin?: boolean;
}

export default function AdminSidebarProfile({
  admin,
  schoolName,
  profileLink = "/admin/profile",
  primaryColor = "#3b82f6",
  isSuperAdmin = false,
}: SidebarProfileProps) {
  const { signOut } = useClerk();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center gap-2.5 p-2 rounded-2xl transition-all duration-300 group border ${isOpen
          ? "bg-gray-100 border-gray-200 shadow-inner"
          : "bg-white border-gray-100 hover:border-gray-300 shadow-sm"
          }`}
      >
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-gray-100 bg-gray-50 overflow-hidden shadow-sm">
          {admin.avatar_url ? (
            <img
              src={admin.avatar_url}
              alt={admin.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={16} className="text-gray-400" />
          )}
        </div>

        <div className="flex-1 text-left min-w-0">
          <p className="text-[11px] font-bold truncate leading-tight text-gray-900 tracking-tight">
            {admin.name}
          </p>
          <p className="text-[9px] font-medium text-gray-400 truncate tracking-tight">
            {schoolName}
          </p>
        </div>

        <div
          className={`transition-transform duration-500 pr-1 ${isOpen ? "rotate-180 text-gray-900" : "text-gray-300 group-hover:text-gray-400"}`}
        >
          <ChevronDown size={14} />
        </div>
      </button>

      {/* Dropdown Menu (Enhanced Professional Profile Card) */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-3 bg-white rounded-[24px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden animate-slide-down border border-gray-100 z-50">
          {/* Branded Header Banner */}
          <div
            className="h-16 w-full relative"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.5)_1px,transparent_0)] bg-[length:12px_12px]" />
          </div>

          <div className="px-4 pb-5 flex flex-col items-center -mt-8 relative z-10">
            {/* Elevated Avatar */}
            <div className="w-16 h-16 rounded-full border-4 border-white bg-white p-0.5 overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.12)] mb-3">
              {admin.avatar_url ? (
                <img
                  src={admin.avatar_url}
                  alt={admin.name}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-full">
                  <User size={28} className="text-gray-300" />
                </div>
              )}
            </div>

            <div className="text-center w-full mb-5">
              <h3 className="text-[13px] font-black text-gray-900 leading-tight mb-0.5 flex items-center justify-center gap-1">
                {admin.name}
                <ShieldCheck size={12} className="text-blue-500" />
              </h3>
              <div className="flex items-center justify-center gap-1 text-gray-400">
                <p className="text-[10px] font-medium truncate tracking-tight opacity-80">
                  {admin.email}
                </p>
              </div>
            </div>

            <div className="w-full space-y-2">
              {isSuperAdmin && (
                <Link
                  href="/admin/super"
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-black text-white border border-black rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-sm active:scale-[0.98]"
                >
                  <ShieldCheck size={12} className="opacity-70" />
                  Super Admin Panel
                </Link>
              )}

              <Link
                href={profileLink}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-white border border-gray-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-900 hover:bg-gray-50 hover:border-gray-200 transition-all shadow-sm active:scale-[0.98]"
              >
                <Settings size={12} className="opacity-40" />
                Manage Account
              </Link>

              <button
                onClick={() => signOut()}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-red-50/50 hover:bg-red-50 text-red-500 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all border border-transparent hover:border-red-100 active:scale-[0.98]"
              >
                <LogOut size={12} className="opacity-60" />
                Sign Out
              </button>
            </div>
          </div>

          <div className="px-4 py-3 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between">
            <div className="flex flex-col">
              <p className="text-[9px] font-bold text-gray-600 uppercase tracking-tight">
                Admin Console
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-white px-2 py-0.5 rounded-full border border-gray-100 shadow-sm">
              <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[8px] font-black text-green-600 uppercase tracking-wider">
                Live
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
