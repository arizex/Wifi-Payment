import { useState } from 'react';
import { X, Loader2, UserPlus } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddCustomerModal({ isOpen, onClose, onSuccess }: AddCustomerModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    monthly_fee: '',
    payment_day: '1',
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.monthly_fee) {
      alert('Nama dan biaya bulanan wajib diisi');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('customers').insert({
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        monthly_fee: parseInt(formData.monthly_fee),
        payment_day: parseInt(formData.payment_day),
        is_active: true,
      });

      if (error) throw error;

      setFormData({ name: '', address: '', phone: '', monthly_fee: '', payment_day: '1' });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding customer:', error);
      alert('Gagal menambahkan pelanggan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <UserPlus className="w-6 h-6 mr-2 text-blue-600" />
            Tambah Pelanggan
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Pelanggan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Masukkan nama"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alamat
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Masukkan alamat"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nomor Telepon
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="08xx xxxx xxxx"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Biaya Bulanan (Rp) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.monthly_fee}
              onChange={(e) => setFormData({ ...formData, monthly_fee: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="100000"
              required
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Pembayaran <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.payment_day}
              onChange={(e) => setFormData({ ...formData, payment_day: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="1">Tanggal 1</option>
              <option value="10">Tanggal 10</option>
              <option value="20">Tanggal 20</option>
            </select>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Menyimpan...
                </>
              ) : (
                'Tambah Pelanggan'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
