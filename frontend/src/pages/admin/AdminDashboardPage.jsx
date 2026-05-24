import { useEffect, useState } from 'react';
import http from '../../api/http';
import { formatCurrency, formatDate } from '../../utils/format';
import StatusBadge from '../../components/common/StatusBadge';

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [message, setMessage] = useState('');

  const load = async () => {
    const res = await http.get('/admin/dashboard');
    setData(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const getNextAction = (status) => {
    if (status === 'pending') return { nextStatus: 'confirmed', label: 'Xác nhận' };
    if (status === 'confirmed') return { nextStatus: 'checked-in', label: 'Check-in' };
    if (status === 'checked-in') return { nextStatus: 'checked-out', label: 'Check-out' };
    return null;
  };

  const updateBookingStatus = async (booking, nextStatus) => {
    try {
      const payload = { status: nextStatus };

      if (nextStatus === 'confirmed') {
        payload.paymentStatus = 'paid';
      }

      await http.patch(`/admin/bookings/${booking.id}/status`, payload);
      setMessage('Cập nhật trạng thái đơn thành công.');
      await load();
    } catch (err) {
      setMessage(err?.response?.data?.message || err.message || 'Cập nhật thất bại.');
    }
  };

  if (!data) return <p>Đang tải dashboard...</p>;

  const stats = [
    ['Cơ sở', data.branches, '🏨'],
    ['Phòng', data.rooms, '🛏️'],
    ['Người dùng', data.users, '👥'],
    ['Đơn chờ', data.pendingBookings, '⏳'],
    ['Doanh thu đã checkout', formatCurrency(data.revenue), '💰']
  ];

  return (
    <div>
      <h1 className="text-3xl font-black">Dashboard quản trị</h1>
      <p className="mt-2 text-slate-500">Tổng quan hệ thống đặt phòng đa cơ sở.</p>

      {message && (
        <div className="mt-5 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
          {message}
        </div>
      )}

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        {stats.map(([label, value, icon]) => (
          <div key={label} className="rounded-3xl bg-white p-6 shadow-lg">
            <div className="text-3xl">{icon}</div>
            <p className="mt-4 text-sm font-bold text-slate-500">{label}</p>
            <p className="mt-1 text-2xl font-black text-slate-950">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-3xl bg-white p-6 shadow-lg">
        <h2 className="text-xl font-black">Đơn mới nhất</h2>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-slate-500">
                <th className="py-3">Khách</th>
                <th>Phòng</th>
                <th>Ngày</th>
                <th>Trạng thái</th>
                <th>Tổng</th>
                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {data.latestBookings.map((b) => {
                const action = getNextAction(b.status);

                return (
                  <tr key={b.id} className="border-b">
                    <td className="py-3 font-semibold">{b.guestName}</td>
                    <td>{b.room?.name}</td>
                    <td>
                      {formatDate(b.checkInDate)} → {formatDate(b.checkOutDate)}
                    </td>
                    <td>
                      <StatusBadge value={b.status} />
                    </td>
                    <td className="font-bold">{formatCurrency(b.totalPrice)}</td>
                    <td>
                      {action ? (
                        <button
                          onClick={() => updateBookingStatus(b, action.nextStatus)}
                          className="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700 transition hover:bg-emerald-100"
                        >
                          {action.label}
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-slate-400">
                          Không có thao tác
                        </span>
                      )}

                      {!['cancelled', 'checked-out'].includes(b.status) && (
                        <button
                          onClick={() => updateBookingStatus(b, 'cancelled')}
                          className="ml-2 rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-600 transition hover:bg-red-100"
                        >
                          Hủy
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}