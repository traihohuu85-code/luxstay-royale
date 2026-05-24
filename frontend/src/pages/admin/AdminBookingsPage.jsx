import { useEffect, useState } from 'react';
import http from '../../api/http';
import StatusBadge from '../../components/common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/format';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]); const [message, setMessage] = useState('');
  const load = () => http.get('/admin/bookings').then((r) => setBookings(r.data)); useEffect(() => { load(); }, []);
  const update = async (id, status) => { try { await http.patch(`/admin/bookings/${id}/status`, { status, paymentStatus: status === 'confirmed' ? 'paid' : undefined }); setMessage('Cập nhật trạng thái thành công.'); load(); } catch (err) { setMessage(err.message); } };
  const next = (status) => status === 'pending' ? ['confirmed','Xác nhận'] : status === 'confirmed' ? ['checked-in','Check-in'] : status === 'checked-in' ? ['checked-out','Check-out'] : null;
  return <div><h1 className="mb-6 text-3xl font-black">Quản lý đặt phòng</h1>{message && <p className="mb-4 rounded-2xl bg-emerald-50 p-3 text-emerald-700">{message}</p>}<div className="overflow-x-auto rounded-3xl bg-white p-5 shadow-lg"><table className="w-full text-left text-sm"><thead><tr className="border-b text-slate-500"><th className="py-3">Mã</th><th>Khách</th><th>Phòng</th><th>Ngày</th><th>Tổng</th><th>TT đơn</th><th>TT tiền</th><th>Thao tác</th></tr></thead><tbody>{bookings.map((b) => { const n = next(b.status); return <tr key={b.id} className="border-b"><td className="py-3 font-black">#{b.id}</td><td><p className="font-bold">{b.guestName}</p><p className="text-xs text-slate-400">{b.guestPhone}</p></td><td>{b.room?.name}</td><td>{formatDate(b.checkInDate)} → {formatDate(b.checkOutDate)}</td><td className="font-bold">{formatCurrency(b.totalPrice)}</td><td><StatusBadge value={b.status} /></td><td><StatusBadge value={b.paymentStatus} /></td><td>{n && <button className="mr-2 rounded-xl bg-emerald-50 px-3 py-2 font-bold text-emerald-700" onClick={() => update(b.id, n[0])}>{n[1]}</button>}{!['cancelled','checked-out'].includes(b.status) && <button className="rounded-xl bg-red-50 px-3 py-2 font-bold text-red-600" onClick={() => update(b.id, 'cancelled')}>Hủy</button>}</td></tr>; })}</tbody></table></div></div>;
}
