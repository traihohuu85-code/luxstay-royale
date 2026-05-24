import { CheckCircle2, CreditCard } from 'lucide-react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { formatCurrency } from '../../utils/format';

export default function PaymentPage() {
  const { bookingId } = useParams();
  const { state } = useLocation();
  const booking = state?.booking;
  return (
    <div className="container-lux py-16">
      <div className="mx-auto max-w-3xl glass-panel p-8 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-100"><CheckCircle2 size={56} /></div>
        <p className="section-kicker mt-6">Payment demo</p>
        <h1 className="mt-3 font-display text-5xl font-bold text-white">Đặt phòng thành công</h1>
        <p className="mt-4 text-slate-400">Đơn đặt phòng #{bookingId} đã được tạo. Đây là màn thanh toán giả lập trực quan để phục vụ bài tập lớn.</p>
        {booking && <div className="mx-auto mt-7 max-w-md rounded-3xl border border-white/10 bg-white/10 p-5 text-left"><p className="flex items-center gap-2 font-bold text-white"><CreditCard size={18} className="text-amber-200" />{booking.room?.name}</p><p className="mt-3 text-sm text-slate-500">Tổng thanh toán</p><p className="font-display text-3xl font-bold text-amber-100">{formatCurrency(booking.totalPrice)}</p></div>}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link to="/bookings" className="btn-primary">Xem lịch sử</Link><Link to="/rooms" className="btn-secondary">Đặt thêm phòng</Link></div>
      </div>
    </div>
  );
}
