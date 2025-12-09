import { useState, useEffect } from 'react';
import { Check, X, Plus, User, Phone, MapPin, Loader2, Trash2 } from 'lucide-react';
import { supabase, Customer, Payment } from '../lib/supabase';

interface CustomerWithPayment extends Customer {
  hasPaid: boolean;
  paymentId?: string;
  paymentDate?: string;
}

interface CustomerListProps {
  selectedMonth: number;
  selectedYear: number;
  searchQuery: string;
  onRefresh: () => void;
}

export default function CustomerList({ selectedMonth, selectedYear, searchQuery, onRefresh }: CustomerListProps) {
  const [customers, setCustomers] = useState<CustomerWithPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    loadCustomers();
  }, [selectedMonth, selectedYear]);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (customerError) throw customerError;

      const { data: paymentData, error: paymentError } = await supabase
        .from('payments')
        .select('*')
        .eq('month', selectedMonth)
        .eq('year', selectedYear);

      if (paymentError) throw paymentError;

      const customersWithPayment = (customerData || []).map(customer => {
        const payment = (paymentData || []).find(p => p.customer_id === customer.id);
        return {
          ...customer,
          hasPaid: !!payment,
          paymentId: payment?.id,
          paymentDate: payment?.payment_date,
        };
      });

      setCustomers(customersWithPayment);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePayment = async (customer: CustomerWithPayment) => {
    setProcessing(customer.id);
    try {
      if (customer.hasPaid && customer.paymentId) {
        const { error } = await supabase
          .from('payments')
          .delete()
          .eq('id', customer.paymentId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('payments')
          .insert({
            customer_id: customer.id,
            month: selectedMonth,
            year: selectedYear,
            amount: customer.monthly_fee,
            payment_date: new Date().toISOString().split('T')[0],
          });

        if (error) throw error;
      }

      await loadCustomers();
      onRefresh();
    } catch (error) {
      console.error('Error toggling payment:', error);
      alert('Gagal memproses pembayaran');
    } finally {
      setProcessing(null);
    }
  };

  const deleteCustomer = async (customer: CustomerWithPayment) => {
    if (!window.confirm(`Yakin ingin menghapus pelanggan "${customer.name}"? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }

    setProcessing(customer.id);
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', customer.id);

      if (error) throw error;

      await loadCustomers();
      onRefresh();
    } catch (error) {
      console.error('Error deleting customer:', error);
      alert('Gagal menghapus pelanggan');
    } finally {
      setProcessing(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <User className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p>Belum ada pelanggan</p>
      </div>
    );
  }

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  if (filteredCustomers.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <User className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p>Tidak ada pelanggan yang cocok dengan pencarian</p>
      </div>
    );
  }

  const paidCount = filteredCustomers.filter(c => c.hasPaid).length;
  const totalCount = filteredCustomers.length;

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg shadow-md">
        <div className="text-sm opacity-90">Status Pembayaran</div>
        <div className="text-3xl font-bold mt-1">
          {paidCount} / {totalCount}
        </div>
        <div className="text-sm opacity-90 mt-1">
          {Math.round((paidCount / totalCount) * 100)}% sudah bayar
        </div>
      </div>

      <div className="space-y-2">
        {filteredCustomers.map((customer) => (
          <div
            key={customer.id}
            className={`bg-white rounded-lg shadow-sm border-2 transition-all ${
              customer.hasPaid
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-lg truncate">
                    {customer.name}
                  </h3>

                  {customer.address && (
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                      <span className="truncate">{customer.address}</span>
                    </div>
                  )}

                  {customer.phone && (
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Phone className="w-4 h-4 mr-1 flex-shrink-0" />
                      <span>{customer.phone}</span>
                    </div>
                  )}

                  <div className="mt-2 text-sm font-medium text-gray-900">
                    {formatCurrency(customer.monthly_fee)}
                  </div>

                  {customer.hasPaid && customer.paymentDate && (
                    <div className="mt-2 text-xs text-green-700 bg-green-100 inline-block px-2 py-1 rounded">
                      Dibayar: {new Date(customer.paymentDate).toLocaleDateString('id-ID')}
                    </div>
                  )}
                </div>

                <div className="ml-4 flex-shrink-0 flex gap-2">
                  <button
                    onClick={() => togglePayment(customer)}
                    disabled={processing === customer.id}
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                      customer.hasPaid
                        ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {processing === customer.id ? (
                      <Loader2 className="w-8 h-8 animate-spin" />
                    ) : customer.hasPaid ? (
                      <Check className="w-8 h-8" strokeWidth={3} />
                    ) : (
                      <X className="w-8 h-8" strokeWidth={3} />
                    )}
                  </button>
                  <button
                    onClick={() => deleteCustomer(customer)}
                    disabled={processing === customer.id}
                    className="w-16 h-16 rounded-full flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-8 h-8" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
