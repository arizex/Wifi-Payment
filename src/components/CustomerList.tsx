import { useState, useEffect } from 'react';
import { Check, X, Plus, User, Phone, MapPin, Loader2, Trash2, FileText } from 'lucide-react';
import { supabase, Customer, Payment } from '../lib/supabase';
import Invoice from './Invoice';

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
  triggerRefresh: number;
}

export default function CustomerList({ selectedMonth, selectedYear, searchQuery, onRefresh, triggerRefresh }: CustomerListProps) {
  const [customers, setCustomers] = useState<CustomerWithPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [invoiceCustomer, setInvoiceCustomer] = useState<CustomerWithPayment | null>(null);
  const [selectedPaymentDay, setSelectedPaymentDay] = useState(1);

  useEffect(() => {
    loadCustomers();
  }, [selectedMonth, selectedYear, triggerRefresh]);

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

  const dayCustomers = filteredCustomers.filter(c => c.payment_day === selectedPaymentDay);

  if (filteredCustomers.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <User className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p>Tidak ada pelanggan yang cocok dengan pencarian</p>
      </div>
    );
  }

  const groupedByPaymentDay = {
    1: filteredCustomers.filter(c => c.payment_day === 1),
    10: filteredCustomers.filter(c => c.payment_day === 10),
    20: filteredCustomers.filter(c => c.payment_day === 20),
  };

  const paidCount = dayCustomers.filter(c => c.hasPaid).length;
  const totalCount = dayCustomers.length;

  return (
    <div className="space-y-6">
      {invoiceCustomer && (
        <Invoice
          customerName={invoiceCustomer.name}
          customerAddress={invoiceCustomer.address}
          customerPhone={invoiceCustomer.phone}
          monthlyFee={invoiceCustomer.monthly_fee}
          paymentDay={invoiceCustomer.payment_day}
          month={selectedMonth}
          year={selectedYear}
          onClose={() => setInvoiceCustomer(null)}
        />
      )}

      <div className="flex gap-2">
        {[1, 10, 20].map(day => {
          const dayCount = groupedByPaymentDay[day as keyof typeof groupedByPaymentDay].length;
          const dayPaid = groupedByPaymentDay[day as keyof typeof groupedByPaymentDay].filter(c => c.hasPaid).length;
          return (
            <button
              key={day}
              onClick={() => setSelectedPaymentDay(day)}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                selectedPaymentDay === day
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-white border-2 border-gray-300 text-gray-900 hover:border-blue-600'
              }`}
            >
              <div className="text-sm opacity-90">Tgl {day}</div>
              <div className="text-lg font-bold">{dayPaid}/{dayCount}</div>
            </button>
          );
        })}
      </div>

      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg shadow-md">
        <div className="text-sm opacity-90">Status Pembayaran Tanggal {selectedPaymentDay}</div>
        <div className="text-3xl font-bold mt-1">
          {paidCount} / {totalCount}
        </div>
        <div className="text-sm opacity-90 mt-1">
          {totalCount > 0 ? Math.round((paidCount / totalCount) * 100) : 0}% sudah bayar
        </div>
      </div>

      {dayCustomers.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <User className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Tidak ada pelanggan dengan tanggal pembayaran {selectedPaymentDay}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {dayCustomers.map((customer) => (
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
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all text-sm ${
                      customer.hasPaid
                        ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {processing === customer.id ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : customer.hasPaid ? (
                      <Check className="w-6 h-6" strokeWidth={3} />
                    ) : (
                      <X className="w-6 h-6" strokeWidth={3} />
                    )}
                  </button>
                  <button
                    onClick={() => setInvoiceCustomer(customer)}
                    disabled={processing === customer.id}
                    className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 hover:bg-blue-200 text-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FileText className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => deleteCustomer(customer)}
                    disabled={processing === customer.id}
                    className="w-12 h-12 rounded-full flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
}