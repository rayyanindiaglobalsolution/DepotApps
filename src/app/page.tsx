import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 to-blue-100 font-sans text-slate-900">
      {/* Navbar */}
      <nav className="container mx-auto px-6 py-8 flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-blue-600">Swegerrr Depot System</h3>
          <p className="text-sm text-gray-500">Sistem Informasi Manajemen Air Minum</p>
        </div>
        <div className="flex items-center gap-4">

    <Link 
      href="/auth/login" 
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-semibold transition shadow-lg shadow-blue-200"
    >
      Login Admin
    </Link>
  </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-10 pb-20 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-bold mb-4">
            Depot Air Minum Modern
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Sistem Informasi <br />
            Manajemen Air Minum <br />
            <span className="text-blue-600">Swegerrr</span>
          </h1>
          <p className="text-lg text-gray-600 mt-6 leading-relaxed max-w-lg">
            Aplikasi manajemen depot air minum untuk mengelola pelanggan, transaksi harian, laporan mingguan, dan tracking pinjaman galon secara modern.
          </p>
        </div>
        <div className="flex justify-center">
          <div className="bg-white p-8 rounded-[40px] shadow-2xl shadow-blue-100 text-center border border-white">
            <Image 
              src="/maskot.png" 
              alt="Maskot Swegerrr" 
              width={350} 
              height={350} 
              className="mx-auto object-contain"
              priority
            />
            <h3 className="font-bold text-blue-600 mt-6 text-xl">Maskot Swegerrr</h3>
          </div>
        </div>
      </section>

      {/* Section Tentang Depot */}
      <section id="tentang-depot" className="container mx-auto px-6 py-20">
        <div className="bg-white p-10 md:p-16 rounded-[40px] shadow-xl border border-gray-100">
          <h2 className="text-4xl font-extrabold text-center text-slate-900 mb-4">Tentang Depot Air Minum Isi Ulang Swegerrr</h2>
          <h4 className="text-2xl text-blue-600 font-bold text-center mb-10">Kesegaran Murni, Kualitas Teruji</h4>
          
          <p className="text-gray-600 text-lg leading-relaxed text-justify mb-10">
            Depot Air Minum Isi Ulang Swegerrr hadir dengan satu misi utama: menyediakan air minum yang sehat, bersih, dan terjangkau bagi masyarakat. Kami percaya bahwa air minum berkualitas adalah fondasi kesehatan keluarga. Terletak di jantung Desa Sidomulyo, Magelang, kami berkomitmen memberikan standar pelayanan terbaik yang dikelola secara profesional.
          </p>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h4 className="text-xl font-bold text-blue-600 mb-4">Manajemen Profesional & Ahli</h4>
              <ul className="space-y-4 text-gray-600 list-disc list-inside">
                <li><strong>Pemilik (Owner):</strong> Eko Harinatalistini, S.E., M.M</li>
                <li><strong>Direktur Teknis:</strong> Agun Bhirawa A.R, S.Kom</li>
                <li><strong>Tim Pelaksana:</strong> 5 karyawan ramah & terlatih</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold text-blue-600 mb-4">Keunggulan Produk</h4>
              <ul className="space-y-4 text-gray-600 list-disc list-inside">
                <li>Teknologi Filtrasi Tinggi</li>
                <li>Sumber Air Bawah Tanah Terpilih</li>
                <li>Uji Lab Kesehatan Berkala</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 p-8 bg-blue-50 rounded-3xl">
            <h4 className="text-xl font-bold text-blue-600 mb-4">Lokasi & Layanan</h4>
            <p className="text-gray-700 font-semibold mb-2">Jl. Pucang Donomulyo, Dusun Talun, Desa Sidomulyo, RT 01 RW 02 No.15, Kec. Secang, Kab. Magelang.</p>
            <p className="text-gray-600 mb-4">(Tersedia di Google Maps)</p>
            <p className="text-lg font-bold text-blue-800">Telp/WA: 0856 4029 2320 (Layanan Antar-Jemput)</p>
          </div>
        </div>
      </section>

      {/* Floating WA Button */}
      <div className="fixed bottom-8 right-8 flex flex-col items-center z-50">
        <Link href="https://wa.me/6285640292320" target="_blank" className="bg-[#25D366] p-4 rounded-full shadow-xl shadow-green-200 hover:scale-110 transition-transform">
          <Image 
            src="https://cdn-icons-png.flaticon.com/512/733/733585.png" 
            alt="WhatsApp" 
            width={35} 
            height={35} 
          />
        </Link>
      </div>
    </main>
  );
}