import { useEffect, useState } from 'react';
import http from '../../api/http';
import { formatCurrency, formatDate } from '../../utils/format';
import StatusBadge from '../../components/common/StatusBadge';

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  useEffect(() => { http.get('/admin/dashboard').then((res) => setData(res.data)); }, []);
  if (!data) return <p>Đang tải dashboard...</p>;
  const stats = [['Cơ sở', data.branches, '🏨'], ['Phòng', data.rooms, '🛏️'], ['Người dùng', data.users, '👥'], ['Đơn chờ', data.pendingBookings, '⏳'], ['Doanh thu', formatCurrency(data.revenue), '💰']];
  return <div><h1 className="text-3xl font-black">Dashboard quản trị</h1><p className="mt-2 text-slate-500">Tổng quan hệ thống đặt phòng đa cơ sở.</p><div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-5">{stats.map(([label, value, icon]) => <div key={label} className="rounded-3xl bg-white p-6 shadow-lg"><div className="text-3xl">{icon}</div><p className="mt-4 text-sm font-bold text-slate-500">{label}</p><p className="mt-1 text-2xl font-black text-slate-950">{value}</p></div>)}</div><div className="mt-8 rounded-3xl bg-white p-6 shadow-lg"><h2 className="text-xl font-black">Đơn mới nhất</h2><div className="mt-4 overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b text-slate-500"><th className="py-3">Khách</th><th>Phòng</th><th>Ngày</th><th>Trạng thái</th><th>Tổng</th></tr></thead><tbody>{data.latestBookings.map((b) => <tr key={b.id} className="border-b"><td className="py-3 font-semibold">{b.guestName}</td><td>{b.room?.name}</td><td>{formatDate(b.checkInDate)}</td><td><StatusBadge value={b.status} /></td><td className="font-bold">{formatCurrency(b.totalPrice)}</td></tr>)}</tbody></table></div></div></div>;
}
