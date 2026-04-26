export default function DashboardPage() {
    return (
      <div>
        <h2 className="text-2xl font-black text-blue-900 mb-6">Ringkasan Statistik</h2>
        
        {/* Contoh Card Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-blue-100">
              <p className="text-sm text-gray-500 font-medium">Total Transaksi</p>
              <h3 className="text-3xl font-bold text-blue-900 mt-2">1,234</h3>
              <p className="text-xs text-green-600 mt-2 font-bold">↑ +12% dari bulan lalu</p>
            </div>
          ))}
        </div>
      </div>
    );
  }