import { Download, Share2, X, Printer } from 'lucide-react';
import { useRef } from 'react';
import html2canvas from 'html2canvas';

interface InvoiceProps {
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  monthlyFee: number;
  paymentDay: number;
  month: number;
  year: number;
  onClose: () => void;
}

export default function Invoice({
  customerName,
  customerAddress,
  customerPhone,
  monthlyFee,
  paymentDay,
  month,
  year,
  onClose
}: InvoiceProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const monthNames = ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  const handleDownload = async () => {
    if (invoiceRef.current) {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        backgroundColor: '#ffffff'
      });
      const link = document.createElement('a');
      link.href = canvas.toDataURL();
      link.download = `Nota-SofiaNet-${customerName.replace(/\s+/g, '-')}-${monthNames[month]}-${year}.png`;
      link.click();
    }
  };

  const handleShare = async () => {
    if (invoiceRef.current) {
      try {
        const canvas = await html2canvas(invoiceRef.current, {
          scale: 2,
          backgroundColor: '#ffffff'
        });
        
        // Convert to blob
        canvas.toBlob(async (blob) => {
          if (blob) {
            const phoneNumber = customerPhone.replace(/\D/g, '');
            
            // Check if Web Share API is available
            if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], 'nota.png')] })) {
              try {
                const file = new File([blob], `Nota-${customerName}-${monthNames[month]}-${year}.png`, { type: 'image/png' });
                await navigator.share({
                  files: [file],
                  title: 'Nota Pembayaran sofia.net',
                  text: `Nota pembayaran ${customerName} - ${monthNames[month]} ${year}`
                });
              } catch (err) {
                console.log('Share cancelled or failed:', err);
                // Fallback to download if share fails
                fallbackDownloadAndShare(canvas, phoneNumber);
              }
            } else {
              // Fallback: Download image and open WhatsApp with text
              fallbackDownloadAndShare(canvas, phoneNumber);
            }
          }
        }, 'image/png');
      } catch (error) {
        console.error('Error sharing:', error);
        alert('Gagal membagikan nota. Silakan download dan kirim manual.');
      }
    }
  };

  const fallbackDownloadAndShare = (canvas: HTMLCanvasElement, phoneNumber: string) => {
    // Auto download the image
    const link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download = `Nota-${customerName}-${monthNames[month]}-${year}.png`;
    link.click();
    
    // Open WhatsApp with message
    const message = encodeURIComponent(
      `Halo ${customerName},\n\nBerikut nota pembayaran WiFi sofia.net bulan ${monthNames[month]} ${year}.\n\nTagihan: Rp${monthlyFee.toLocaleString('id-ID')}\nJatuh tempo: ${paymentDay} ${monthNames[month]} ${year}\n\nMohon segera melakukan pembayaran.\n\nTerima kasih! 🙏`
    );
    
    setTimeout(() => {
      window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
      alert('Nota telah didownload. Silakan kirim file nota tersebut ke WhatsApp yang sudah terbuka.');
    }, 500);
  };

  const handlePrint = () => {
    if (invoiceRef.current) {
      const printWindow = window.open('', '', 'height=600,width=400');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Nota - sofia.net</title>
              <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { 
                  margin: 0; 
                  padding: 15px; 
                  font-family: 'Courier New', monospace;
                  font-size: 12px;
                  background: white;
                }
                .nota-container {
                  max-width: 380px;
                  margin: 0 auto;
                  padding: 20px;
                  border: 2px dashed #666;
                }
                .header {
                  text-align: center;
                  border-bottom: 2px solid black;
                  padding-bottom: 10px;
                  margin-bottom: 10px;
                }
                .brand {
                  font-size: 24px;
                  font-weight: bold;
                  margin-bottom: 3px;
                }
                .subtitle {
                  font-size: 11px;
                }
                .section {
                  border-bottom: 1px dashed #999;
                  padding: 8px 0;
                  margin-bottom: 8px;
                  font-size: 11px;
                }
                .section-title {
                  font-weight: bold;
                  margin-bottom: 5px;
                }
                .row {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 3px;
                }
                .total-section {
                  border-top: 2px solid black;
                  padding-top: 8px;
                  margin: 10px 0;
                }
                .total-row {
                  display: flex;
                  justify-content: space-between;
                  font-size: 15px;
                  font-weight: bold;
                }
                .due-date {
                  text-align: center;
                  padding: 8px;
                  background: #f0f0f0;
                  border: 1px solid #999;
                  margin: 10px 0;
                  font-size: 11px;
                }
                .due-title {
                  font-weight: bold;
                  margin-bottom: 3px;
                }
                .footer {
                  text-align: center;
                  font-size: 10px;
                  color: #666;
                  border-top: 1px dashed #999;
                  padding-top: 10px;
                  margin-top: 10px;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                  font-size: 11px;
                  margin: 5px 0;
                }
                th {
                  text-align: left;
                  border-bottom: 2px solid black;
                  padding: 5px 0;
                  font-weight: bold;
                }
                th.right, td.right {
                  text-align: right;
                }
                td {
                  padding: 8px 0;
                }
                .item-desc {
                  color: #666;
                  font-size: 10px;
                  margin-top: 2px;
                }
                @media print {
                  body { padding: 5px; }
                  .nota-container { border-color: black; }
                }
              </style>
            </head>
            <body>
              <div class="nota-container">
                <div class="header">
                  <div class="brand">SOFIA.NET</div>
                  <div class="subtitle">LAYANAN INTERNET</div>
                </div>

                <div class="section">
                  <div class="row">
                    <span>No. Nota</span>
                    <strong>INV${String(month).padStart(2, '0')}${year}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}</strong>
                  </div>
                  <div class="row">
                    <span>Tanggal</span>
                    <span>${new Date().toLocaleDateString('id-ID')}</span>
                  </div>
                  <div class="row">
                    <span>Periode</span>
                    <span>${monthNames[month]} ${year}</span>
                  </div>
                </div>

                <div class="section">
                  <div class="section-title">PELANGGAN:</div>
                  <div>${customerName}</div>
                  ${customerAddress ? `<div style="color: #666; margin-top: 2px;">${customerAddress}</div>` : ''}
                  ${customerPhone ? `<div style="color: #666; margin-top: 2px;">${customerPhone}</div>` : ''}
                </div>

                <div>
                  <table>
                    <thead>
                      <tr>
                        <th>ITEM</th>
                        <th class="right">HARGA</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div>Langganan WiFi</div>
                          <div class="item-desc">${monthNames[month]} ${year}</div>
                        </td>
                        <td class="right">${formatCurrency(monthlyFee)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div class="total-section">
                  <div class="total-row">
                    <span>TOTAL</span>
                    <span>Rp ${formatCurrency(monthlyFee)}</span>
                  </div>
                </div>

                <div class="due-date">
                  <div class="due-title">⚠️ JATUH TEMPO</div>
                  <div>${paymentDay} ${monthNames[month]} ${year}</div>
                </div>

                <div class="section" style="text-align: center; border: none;">
                  <div>Harap bayar sebelum tanggal jatuh tempo</div>
                  <div>untuk menghindari pemutusan layanan</div>
                </div>

                <div class="footer">
                  <div style="margin-bottom: 5px;">Terima kasih atas kepercayaan Anda</div>
                  <div>Copyright © by <strong>aris.dev</strong></div>
                </div>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('id-ID');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
          <h2 className="text-lg font-bold text-gray-900">Nota Pembayaran</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4">
          <div
            ref={invoiceRef}
            className="bg-white p-6 border-2 border-dashed border-gray-400"
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: '13px',
              maxWidth: '400px',
              margin: '0 auto'
            }}
          >
            {/* Header */}
            <div className="text-center border-b-2 border-black pb-3 mb-3">
              <div className="text-2xl font-bold mb-1">SOFIA.NET</div>
              <div className="text-xs">LAYANAN INTERNET</div>
            </div>

            {/* Info Nota */}
            <div className="text-xs mb-3 pb-3 border-b border-dashed border-gray-400">
              <div className="flex justify-between mb-1">
                <span>No. Nota</span>
                <span className="font-bold">INV{String(month).padStart(2, '0')}{year}-{String(Math.floor(Math.random() * 9999)).padStart(4, '0')}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Tanggal</span>
                <span>{new Date().toLocaleDateString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span>Periode</span>
                <span>{monthNames[month]} {year}</span>
              </div>
            </div>

            {/* Data Pelanggan */}
            <div className="text-xs mb-3 pb-3 border-b border-dashed border-gray-400">
              <div className="font-bold mb-2">PELANGGAN:</div>
              <div className="mb-1">{customerName}</div>
              {customerAddress && (
                <div className="mb-1 text-gray-700">{customerAddress}</div>
              )}
              {customerPhone && (
                <div className="text-gray-700">{customerPhone}</div>
              )}
            </div>

            {/* Detail Tagihan */}
            <div className="mb-3">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b-2 border-black">
                    <th className="text-left py-1 font-bold">ITEM</th>
                    <th className="text-right py-1 font-bold">HARGA</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2">
                      <div>Langganan WiFi</div>
                      <div className="text-gray-600">{monthNames[month]} {year}</div>
                    </td>
                    <td className="text-right py-2">
                      {formatCurrency(monthlyFee)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Total */}
            <div className="border-t-2 border-black pt-2 mb-3">
              <div className="flex justify-between items-center text-base font-bold">
                <span>TOTAL</span>
                <span>Rp {formatCurrency(monthlyFee)}</span>
              </div>
            </div>

            {/* Jatuh Tempo */}
            <div className="text-center text-xs mb-3 py-2 bg-gray-100 border border-gray-400">
              <div className="font-bold">⚠️ JATUH TEMPO</div>
              <div className="mt-1">{paymentDay} {monthNames[month]} {year}</div>
            </div>

            {/* Catatan */}
            <div className="text-center text-xs text-gray-700 mb-3 pb-3 border-b border-dashed border-gray-400">
              <div>Harap bayar sebelum tanggal jatuh tempo</div>
              <div className="mt-1">untuk menghindari pemutusan layanan</div>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-gray-600">
              <div className="mb-2">Terima kasih atas kepercayaan Anda</div>
              <div className="border-t border-gray-400 pt-2">
                <div>Copyright © by <strong>aris.dev</strong></div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <button
              onClick={handlePrint}
              className="flex flex-col items-center justify-center gap-1 px-3 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
            >
              <Printer className="w-5 h-5" />
              Print
            </button>
            <button
              onClick={handleDownload}
              className="flex flex-col items-center justify-center gap-1 px-3 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
            >
              <Download className="w-5 h-5" />
              Download
            </button>
            <button
              onClick={handleShare}
              className="flex flex-col items-center justify-center gap-1 px-3 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-sm font-medium"
            >
              <Share2 className="w-5 h-5" />
              WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}