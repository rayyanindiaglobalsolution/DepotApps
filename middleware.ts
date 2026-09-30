import { withAuth } from "next-auth/middleware";

// Middleware ini akan memproteksi rute yang didefinisikan di matcher
export default withAuth({
  // Kita tidak perlu menulis ulang 'pages' di sini jika sudah didefinisikan di auth.ts.
  // Middleware akan secara otomatis membaca konfigurasi dari authOptions.
});

export const config = {
  // Hanya simpan rute yang ingin diproteksi (hanya bisa diakses setelah login)
  matcher: ["/transaksi/:path*", "/dashboard/:path*"],
};