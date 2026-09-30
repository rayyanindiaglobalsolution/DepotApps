"use client";

import { deletePelanggan } from "@/app/actions/pelanggan";

export default function DeleteButton({ id }: { id: number }) {
  const handleDelete = (formData: FormData) => {
    if (confirm("Apakah Anda yakin ingin menghapus pelanggan ini?")) {
      deletePelanggan(id);
    }
  };

  return (
    <form action={handleDelete}>
      <button
        type="submit"
        className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition"
      >
        Hapus
      </button>
    </form>
  );
}