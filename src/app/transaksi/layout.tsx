import { AppSidebar } from "@/components/app-sidebar";

export default function TransaksiLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <AppSidebar />
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}