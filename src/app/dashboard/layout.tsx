import { AppSidebar } from "@/components/app-sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar - akan tetap di kiri */}
      <div className="hidden md:flex"> 
        <AppSidebar />
      </div>
      
      {/* Konten utama - dengan pembatas lebar agar lebih fokus */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  )
}