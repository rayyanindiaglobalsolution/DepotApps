"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from '@/components/LogoutButton'; 
import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart, 
  FileText, 
  Wallet, 
  MapPin,
  ClipboardList,
  Package // Icon baru untuk Stok Galon Depot
} from 'lucide-react';

export function AppSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Stok Galon Depot", href: "/dashboard/setting-galon", icon: Package }, // Persis di bawah Dashboard
    { label: "Data Pelanggan", href: "/dashboard/pelanggan", icon: Users },
    { label: "Transaksi Harian", href: "/transaksi", icon: ShoppingCart },
    { label: "Laporan Mingguan", href: "/dashboard/laporan", icon: FileText },
    { label: "Manajemen Gaji", href: "/dashboard/gaji", icon: Wallet },
    { label: "Absensi Karyawan", href: "/dashboard/absensi", icon: ClipboardList },
    { label: "Peta Pelanggan", href: "/dashboard/peta", icon: MapPin },
  ];

  return (
    <aside className="w-64 bg-black/85 text-white min-h-screen flex flex-col shadow-2xl backdrop-blur-sm">
      <div className="p-6 text-xl font-bold tracking-widest text-white border-b border-white/10">
        SWEGERRR
      </div>
      
      <nav className="flex-1 px-3 py-6 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center p-4 rounded-xl transition-all ${
                isActive 
                  ? "bg-white/20 text-white font-medium"
                  : "hover:bg-white/10 text-gray-300"
              }`}
            >
              <Icon size={20} />
              <span className="ml-3">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      
      {/* Area Bagian Bawah (Footer) */}
      <div className="mt-auto flex flex-col">
        <div className="px-6 py-2 text-[10px] text-gray-500 uppercase tracking-widest text-center font-medium">
          Powered By : Kelompok A Capstone Project 88
        </div>
        
        <div className="p-6 border-t border-white/10">
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
}