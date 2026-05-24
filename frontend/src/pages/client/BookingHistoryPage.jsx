import { useEffect, useState } from 'react';
import { CalendarDays, MapPin, XCircle } from 'lucide-react';
import http from '../../api/http';
import { formatCurrency, formatDate } from '../../utils/format';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';

export default function BookingHistoryPage() {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState('');
  const load = () => http.get('/bookings/my').then((res) => setBookings(res.data));
  useEffect(() => { load(); }, []);

  const cancel = async (id) => {
    if (!confirm('Bạn chắc chắn muốn hủy đơn này?')) return;
    try { await http.patch(`/bookings/${id}/cancel`); setMessage('Đã hủy đơn thành công.'); load(); } catch (err) { setMessage(err.message); }
  };

  return (
    <div className="container-lux py-12">
      <div className="glass-panel p-8"><p className="section-kicker">Booking history</p><h1 className="section-title mt-3">Lịch sử đặt phòng</h1><p className="mt-3 text-slate-400">Theo dõi trạng thái đặt phòng, check-in/check-out và thanh toán.</p></div>
      {message && <div className="mt-6 rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-4 text-sm font-bold text-emerald-100">{message}</div>}
      <div className="mt-8 grid gap-5">
        {bookings.length ? bookings.map((booking) => (
          <div key={booking.id} className="glass-panel overflow-hidden p-5 md:flex md:items-center md:gap-6">
            <img src={booking.room?.images?.[0]} alt={booking.room?.name} className="h-44 w-full rounded-2xl object-cover md:w-60" />
            <div className="mt-4 flex-1 md:mt-0">
              <div className="flex flex-wrap gap-2"><StatusBadge value={booking.status} /><StatusBadge value={booking.paymentStatus} /></div>
              <h3 className="mt-3 font-display text-2xl font-bold text-white">{booking.room?.name}</h3>
              <p className="mt-2 flex items-center gap-2 text-sm text-slate-400"><MapPin size={16} className="text-amber-200" />{booking.room?.branch?.name}</p>
              <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-300"><CalendarDays size={16} className="text-amber-200" />{formatDate(booking.checkInDate)} → {formatDate(booking.checkOutDate)} • {booking.nights} đêm</p>
            </div>
            <div className="mt-4 text-left md:mt-0 md:text-right">
              <p className="text-2xl font-black text-amber-100">{formatCurrency(booking.totalPrice)}</p>
              {['pending', 'confirmed'].includes(booking.status) && <button onClick={() => cancel(booking.id)} className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-red-500/15 px-4 py-2 text-sm font-bold text-red-100 hover:bg-red-500/25"><XCircle size={16} />Hủy đơn</button>}
            </div>
          </div>
        )) : <EmptyState title="Bạn chưa có đơn đặt phòng" description="Hãy chọn một căn phòng thật đẹp và đặt phòng ngay." />}
      </div>
    </div>
  );
}
