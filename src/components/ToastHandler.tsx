"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function ToastHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("status") === "success") {
      toast.success("Data berhasil diperbarui!");
    }
  }, [searchParams]);

  return null; // Komponen ini tidak merender apa-apa
}