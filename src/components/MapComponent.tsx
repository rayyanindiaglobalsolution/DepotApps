import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

const createPinIcon = (colorHex: string) => {
  return L.divIcon({
    className: 'custom-pin',
    html: `
      <div style="
        background-color: ${colorHex};
        width: 22px;
        height: 22px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        left: -4px;
        top: -4px;
        position: relative;
        border: 2px solid #ffffff;
        box-shadow: 0 3px 6px rgba(0,0,0,0.4);
      "></div>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 22],
    popupAnchor: [0, -22],
  });
};

const iconDepot = createPinIcon('#eab308');
const iconUsaha = createPinIcon('#3b82f6');
const iconRumahTangga = createPinIcon('#f97316');
const iconDefault = createPinIcon('#64748b');

function RoutingMachine({ start, end }: { start: [number, number]; end: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !start || !end) return;

    let routingControl: any = null;

    try {
      routingControl = L.Routing.control({
        waypoints: [
          L.latLng(start[0], start[1]),
          L.latLng(end[0], end[1])
        ],
        routeWhileDragging: false,
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        showAlternatives: false,
        show: false,
        lineOptions: {
          styles: [{ color: '#3b82f6', opacity: 0.8, weight: 5 }]
        },
        createMarker: () => null 
      } as any).addTo(map);
    } catch (e) {
      console.error("Gagal membuat rute:", e);
    }

    return () => {
      if (routingControl && map) {
        try {
          if (map.hasLayer(routingControl as any)) {
            map.removeControl(routingControl);
          }
        } catch (e) {
          console.error("Gagal menghapus kontrol routing:", e);
        }
      }
    };
  }, [map, start, end]);

  return null;
}

function MapController({ geoJsonData, targetCenter, targetZoom }: { geoJsonData: any; targetCenter?: [number, number]; targetZoom?: number }) {
  const map = useMap();
  
  useEffect(() => {
    if (targetCenter && targetZoom) {
      map.setView(targetCenter, targetZoom, { animate: true });
    } else if (geoJsonData && !targetCenter) {
      const geoJsonLayer = L.geoJSON(geoJsonData);
      map.fitBounds(geoJsonLayer.getBounds(), { padding: [20, 20] });
    }
  }, [geoJsonData, targetCenter, targetZoom, map]);

  return null;
}

const getPelangganCoordinates = (p: any): [number, number] | null => {
  let lat = Number(p.latitude);
  let lng = Number(p.longitude);

  if ((!lat || !lng || isNaN(lat) || isNaN(lng)) && p.lokasi_maps) {
    const coords = p.lokasi_maps.split(",");
    if (coords.length >= 2) {
      lat = Number(coords[0].trim());
      lng = Number(coords[1].trim());
    }
  }

  if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
    return [lat, lng];
  }
  return null;
};

export default function MapComponent({ dataPelanggan }: { dataPelanggan: any[] }) {
  const defaultCenter: [number, number] = [-7.418774014672416, 110.26734421534329];
  const [basemap, setBasemap] = useState<string>("google-sat");
  const [filterJenis, setFilterJenis] = useState<string>("semua");
  const [filterAlamat, setFilterAlamat] = useState<string>("semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isOpenToolbox, setIsOpenToolbox] = useState<boolean>(true);
  
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [showBatas, setShowBatas] = useState<boolean>(true);
  const [mapTarget, setMapTarget] = useState<{ center?: [number, number]; zoom?: number }>({});
  
  const [activeRoute, setActiveRoute] = useState<{ start: [number, number]; end: [number, number] } | null>(null);

  const depotLokasi = {
    nama: "Depot Swegerrr",
    lat: -7.418920279854221,
    lng: 110.26730216224445,
  };

  useEffect(() => {
    fetch('/batas_kecamatan.geojson')
      .then((res) => res.json())
      .then((data) => setGeoJsonData(data))
      .catch((err) => console.error("Gagal memuat GeoJSON:", err));
  }, []);

  const daftarAlamat = Array.from(
    new Set(
      dataPelanggan
        ?.map((p) => p.alamat?.trim())
        .filter(Boolean)
        .map((alm) => alm.toLowerCase())
    )
  ).sort((a, b) => a.localeCompare(b)) as string[];

  const basemapUrls: Record<string, { url: string; attribution: string }> = {
    "google-sat": {
      url: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
      attribution: "&copy; Google Maps",
    },
    standard: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: "&copy; OpenStreetMap contributors",
    },
  };

  const filteredData = dataPelanggan?.filter((p) => {
    const jenisDb = p.jenis?.trim().toLowerCase() || "";
    const filterJ = filterJenis.trim().toLowerCase();

    let matchesJenis = true;
    if (filterJenis !== "semua") {
      if (filterJ.includes("usaha")) {
        matchesJenis = jenisDb.includes("usaha");
      } else if (filterJ.includes("rumah")) {
        matchesJenis = jenisDb.includes("rumah");
      } else {
        matchesJenis = jenisDb === filterJ;
      }
    }

    const matchesAlamat = filterAlamat === "semua" || p.alamat?.trim().toLowerCase() === filterAlamat.toLowerCase();
    
    const query = searchQuery.toLowerCase();
    const matchesSearch = !query || 
      p.nama?.toLowerCase().includes(query) || 
      p.alamat?.toLowerCase().includes(query) ||
      p.no_hp?.toLowerCase().includes(query);

    return matchesJenis && matchesAlamat && matchesSearch;
  });

  const handleSelectPelanggan = (p: any) => {
    const coords = getPelangganCoordinates(p);
    if (coords) {
      setMapTarget({ center: coords, zoom: 18 });
      setSearchQuery(p.nama);
    }
  };

  const handleShowRoute = (p: any) => {
    const coords = getPelangganCoordinates(p);
    if (coords) {
      setActiveRoute({
        start: [depotLokasi.lat, depotLokasi.lng],
        end: coords
      });
      setMapTarget({ center: coords, zoom: 16 });
    }
  };

  return (
    <div className="relative w-full -mt-4 ml-0 mr-[-1.5rem] lg:mr-[-2rem] h-[calc(100vh-70px)] min-h-[720px] overflow-hidden shadow-sm">
      <MapContainer
        center={defaultCenter}
        zoom={15}
        zoomControl={false}
        className="w-full h-full z-0 rounded-none"
      >
        <TileLayer
          url={basemapUrls[basemap].url}
          attribution={basemapUrls[basemap].attribution}
          maxZoom={20}
        />

        <MapController geoJsonData={geoJsonData} targetCenter={mapTarget.center} targetZoom={mapTarget.zoom} />

        {activeRoute && (
          <RoutingMachine start={activeRoute.start} end={activeRoute.end} />
        )}

        {geoJsonData && showBatas && (
          <GeoJSON
            data={geoJsonData}
            style={() => ({
              color: "#ef4444",
              weight: 2,
              fillColor: "#ef4444",
              fillOpacity: 0.05,
            })}
          />
        )}

        <Marker position={[depotLokasi.lat, depotLokasi.lng]} icon={iconDepot}>
          <Popup>
            <div className="p-1 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <p className="font-bold text-slate-800 text-sm">{depotLokasi.nama}</p>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold text-white bg-yellow-500">
                  Pusat Depot
                </span>
              </div>
              <p className="text-xs text-gray-600 font-medium">Titik Acuan Utama / Lokasi Depot</p>
            </div>
          </Popup>
        </Marker>

        {filteredData?.map((p) => {
          const coords = getPelangganCoordinates(p);
          if (!coords) return null;

          const jenisStr = p.jenis?.trim().toLowerCase() || "";
          let markerIcon = iconDefault;
          let isUsaha = false;

          if (jenisStr.includes("usaha")) {
            markerIcon = iconUsaha;
            isUsaha = true;
          } else if (jenisStr.includes("rumah")) {
            markerIcon = iconRumahTangga;
            isUsaha = false;
          }

          const waText = `Halo Kurir, silakan klik link berikut untuk menuju lokasi pengiriman:\nNama: ${p.nama}\nAlamat: ${p.alamat || '-'}\nNo HP: ${p.no_hp || '-'}\n\nLink Google Maps:\nhttps://www.google.com/maps/dir/?api=1&destination=${coords[0]},${coords[1]}`;

          return (
            <Marker key={p.id} position={coords} icon={markerIcon}>
              <Popup>
                <div className="p-1 space-y-2 min-w-[200px]">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-bold text-slate-800 text-sm">{p.nama}</p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold text-white ${isUsaha ? 'bg-blue-500' : 'bg-orange-500'}`}>
                      {p.jenis || "Umum"}
                    </span>
                  </div>
                  <div className="space-y-0.5 text-xs text-gray-600">
                    <p>Alamat: {p.alamat || "-"}</p>
                    <p className="font-medium">No. Telp: {p.no_hp || "-"}</p>
                    <p className="text-blue-600 font-semibold pt-1">
                      Saldo Aqua: {p.saldo_aqua ?? 0} | Keran: {p.saldo_keran ?? 0}
                    </p>
                  </div>
                  
                  <div className="pt-2 border-t mt-2 space-y-1.5">
                    <button
                      onClick={() => handleShowRoute(p)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1.5 px-3 rounded-lg shadow transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>🧭 Tampilkan Rute di Peta</span>
                    </button>

                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(waText)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-green-600 hover:bg-green-700 text-white text-xs font-semibold py-1.5 px-3 rounded-lg shadow transition flex items-center justify-center gap-1.5 block text-center cursor-pointer"
                    >
                      <span>💬 Kirim Rute ke WhatsApp Kurir</span>
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <div className="absolute top-4 left-4 z-[400] bg-white/95 backdrop-md p-3 rounded-xl shadow-lg border w-48 space-y-2.5">
        <div className="flex items-center justify-between border-b pb-1.5">
          <h3 className="font-bold text-xs text-slate-800">Toolbox Peta</h3>
          <button
            onClick={() => setIsOpenToolbox(!isOpenToolbox)}
            className="text-[11px] text-gray-500 hover:text-black font-medium"
          >
            {isOpenToolbox ? "Sembunyikan" : "Tampilkan"}
          </button>
        </div>

        {isOpenToolbox && (
          <div className="space-y-2.5 text-xs">
            {activeRoute && (
              <button
                onClick={() => setActiveRoute(null)}
                className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-[11px] font-semibold py-1 px-2 rounded-lg transition"
              >
                ✖ Tutup Jalur Rute
              </button>
            )}

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block text-[11px]">Cari Pelanggan</label>
              <input
                type="text"
                placeholder="Nama / Alamat / No. HP..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border rounded-lg p-1.5 bg-white text-gray-700 text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {searchQuery && (
                <div className="max-h-28 overflow-y-auto border rounded bg-slate-50 mt-1 divide-y">
                  {filteredData.length > 0 ? (
                    filteredData.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handleSelectPelanggan(p)}
                        className="p-1 hover:bg-blue-100 cursor-pointer text-[10px] text-slate-700"
                      >
                        <span className="font-bold">{p.nama}</span>
                        <span className="text-gray-500 block">{p.alamat || "Tanpa alamat"}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-1 text-[10px] text-gray-400 text-center">Tidak ditemukan</div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block text-[11px]">Filter Alamat</label>
              <select
                value={filterAlamat}
                onChange={(e) => setFilterAlamat(e.target.value)}
                className="w-full border rounded-lg p-1 bg-white text-gray-700 text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="semua">Semua Alamat</option>
                {daftarAlamat.map((alm, idx) => (
                  <option key={idx} value={alm}>
                    {alm.charAt(0).toUpperCase() + alm.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block text-[11px]">Filter Jenis</label>
              <select
                value={filterJenis}
                onChange={(e) => setFilterJenis(e.target.value)}
                className="w-full border rounded-lg p-1 bg-white text-gray-700 text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="semua">Semua Jenis</option>
                <option value="usaha">Usaha</option>
                <option value="rumah tangga">Rumah Tangga</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block text-[11px]">Layer Peta</label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showBatas}
                  onChange={(e) => setShowBatas(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-700 text-[11px]">Batas Wilayah</span>
              </label>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block text-[11px]">Base Map</label>
              <select
                value={basemap}
                onChange={(e) => setBasemap(e.target.value)}
                className="w-full border rounded-lg p-1 bg-white text-gray-700 text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="google-sat">Google Satellite</option>
                <option value="standard">Standard (OSM)</option>
              </select>
            </div>

            <div className="pt-1.5 border-l-2 border-yellow-400 pl-2 space-y-1 text-[10px] text-gray-600">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block"></span>
                <span className="font-bold text-slate-800">Depot (Pusat)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
                <span>Batas Wilayah</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
                <span>Usaha</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-500 inline-block"></span>
                <span>Rumah Tangga</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}