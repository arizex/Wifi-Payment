import { useState, useEffect } from 'react';
import { X, Loader2, Calendar, DollarSign } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PaymentHistoryProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PaymentRecord {
  id: string;
  payment_date: string;
  month: number;
  year: number;
  amount: number;
  notes: string | null;
  customers: {
    name: string;
  }[] | null;
}

export default function PaymentHistory({ isOpen, onClose }: PaymentHistoryProps) {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterMonth, setFilterMonth] = useState<number>(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    if (isOpen) {
      loadPayments();
    }
  }, [isOpen, filterMonth, filterYear]);

  const loadPayments = async () => {
    setLoading(true);
    try {
      // First, get payments
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .eq('month', filterMonth)
        .eq('year', filterYear)
        .order('payment_date', { ascending: false });

      if (paymentsError) throw paymentsError;

      // Then, get customers for those payments
      const paymentsWithCustomers = await Promise.all(
        (paymentsData || []).map(async (payment) => {
          const { data: customerData } = await supabase
            .from('customers')
            .select('name')
            .eq('id', payment.customer_id)
            .single();

          return {
            ...payment,
            customers: customerData ? [customerData] : null
          };
        })
      );

      console.log('Payment data with customers:', paymentsWithCustomers);
      setPayments(paymentsWithCustomers);
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Calendar className="w-6 h-6 mr-2 text-blue-600" />
            Riwayat Pembayaran
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 bg-gray-50 border-b">
          <div className="flex gap-2">
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(parseInt(e.target.value))}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {monthNames.map((name, idx) => (
                <option key={idx} value={idx + 1}>
                  {name}
                </option>
              ))}
            </select>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {!loading && (
            <div className="mt-3 bg-blue-600 text-white p-3 rounded-lg">
              <div className="text-sm opacity-90">Total Pembayaran</div>
              <div className="text-2xl font-bold">{formatCurrency(totalAmount)}</div>
              <div className="text-sm opacity-90">{payments.length} transaksi</div>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <DollarSign className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Belum ada pembayaran</p>
            </div>
          ) : (
            <div className="space-y-2">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {payment.customers?.[0]?.name || 'Unknown'}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(payment.payment_date).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      {payment.notes && (
                        <p className="text-sm text-gray-500 mt-1 italic">{payment.notes}</p>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-green-600">
                        {formatCurrency(payment.amount)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}