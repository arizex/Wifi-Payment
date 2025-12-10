import { useState } from 'react';
import { Plus, History, Calendar, Wifi, Search, X } from 'lucide-react';
import CustomerList from './components/CustomerList';
import AddCustomerModal from './components/AddCustomerModal';
import PaymentHistory from './components/PaymentHistory';

function App() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [triggerRefresh, setTriggerRefresh] = useState(0);

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const handleRefresh = () => {
    setTriggerRefresh(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-center text-center mb-6">
            <div className="flex items-center">
             <div>
                <h1 className="text-2xl font-bold text-blue-900">
                  SOFIA.NET WIFI PAYMENT
                </h1>
                <p className="text-sm text-gray-600">
                  Created by Aris Developer Handal
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Search className="w-4 h-4 mr-2" />
                Cari Pelanggan
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nama, alamat, atau nomor telepon..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Pilih Periode
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white font-medium"
                >
                  {monthNames.map((name, idx) => (
                    <option key={idx} value={idx + 1}>
                      {name}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white font-medium"
                >
                  {Array.from({ length: 11 }, (_, i) => new Date().getFullYear() + 5 - i).sort().map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <CustomerList
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          searchQuery={searchQuery}
          onRefresh={handleRefresh}
          triggerRefresh={triggerRefresh}
        />
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4 flex gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg flex items-center justify-center transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Tambah Pelanggan
          </button>
          <button
            onClick={() => setShowHistory(true)}
            className="flex-1 bg-orange-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg flex items-center justify-center transition-colors"
          >
            <History className="w-5 h-5 mr-2" />
            Riwayat
          </button>
        </div>
      </div>

      <AddCustomerModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleRefresh}
      />

      <PaymentHistory
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
      />
    </div>
  );
}

export default App;