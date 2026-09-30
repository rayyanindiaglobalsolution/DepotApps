import "./globals.css"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "sonner" // 1. Import Toaster

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TooltipProvider>
          {children}
        </TooltipProvider>
        
        {/* 2. Tempatkan Toaster di sini agar muncul di seluruh aplikasi */}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}