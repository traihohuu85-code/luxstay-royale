import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Building2, CalendarDays, Filter, Search, SlidersHorizontal, Users } from 'lucide-react';
import http from '../../api/http';
import RoomCard from '../../components/client/RoomCard';
import EmptyState from '../../components/common/EmptyState';

export default function RoomListPage() {
  const [params, setParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [branches, setBranches] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const filter = useMemo(() => Object.fromEntries(params.entries()), [params]);

  useEffect(() => { Promise.all([http.get('/branches'), http.get('/categories')]).then(([b, c]) => { setBranches(b.data); setCategories(c.data); }); }, []);
  useEffect(() => { setLoading(true); http.get(`/rooms?${params.toString()}`).then((res) => setRooms(res.data)).finally(() => setLoading(false)); }, [params]);
  const update = (key, value) => { const next = new URLSearchParams(params); value ? next.set(key, value) : next.delete(key); setParams(next); };
  const reset = () => setParams(new URLSearchParams());

  return (
    <div className="container-lux py-12">
      <div className="glass-panel p-6 md:p-8">
        <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-end"><div><p className="section-kicker">Danh sách phòng</p><h1 className="mt-3 font-display text-4xl font-bold text-white md:text-5xl">Tìm phòng theo cơ sở, danh mục và thời gian</h1></div><button onClick={reset} className="btn-secondary w-fit"><SlidersHorizontal size={16} />Xóa lọc</button></div>
        <div className="grid gap-4 md:grid-cols-6">
          <label className="relative md:col-span-2"><Building2 className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-amber-200" size={18} /><select className="client-input pl-11" value={filter.branchId || ''} onChange={(e) => update('branchId', e.target.value)}><option value="">Tất cả cơ sở</option>{branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select></label>
          <label className="relative"><Filter className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-amber-200" size={18} /><select className="client-input pl-11" value={filter.categoryId || ''} onChange={(e) => update('categoryId', e.target.value)}><option value="">Mọi loại</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
          <div className="client-input date-field"><input className="date-native" type="date" value={filter.checkInDate || ''} onChange={(e) => update('checkInDate', e.target.value)} /><CalendarDays className="date-field-icon" size={18} /></div><div className="client-input date-field"><input className="date-native" type="date" value={filter.checkOutDate || ''} onChange={(e) => update('checkOutDate', e.target.value)} /><CalendarDays className="date-field-icon" size={18} /></div>
          <input className="client-input" type="date" value={filter.checkOutDate || ''} onChange={(e) => update('checkOutDate', e.target.value)} />
          <label className="relative"><Users className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-amber-200" size={18} /><input className="client-input pl-11" type="number" min="1" placeholder="Số khách" value={filter.capacity || ''} onChange={(e) => update('capacity', e.target.value)} /></label>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-4">
          <label className="relative"><Search className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-amber-200" size={18} /><input className="client-input pl-11" placeholder="Tìm theo tên phòng..." value={filter.keyword || ''} onChange={(e) => update('keyword', e.target.value)} /></label>
          <input className="client-input" type="number" placeholder="Giá từ" value={filter.minPrice || ''} onChange={(e) => update('minPrice', e.target.value)} />
          <input className="client-input" type="number" placeholder="Giá đến" value={filter.maxPrice || ''} onChange={(e) => update('maxPrice', e.target.value)} />
          <select className="client-input" value={filter.status || ''} onChange={(e) => update('status', e.target.value)}><option value="">Mọi trạng thái</option><option value="available">Còn phòng</option><option value="maintenance">Bảo trì</option></select>
        </div>
      </div>
      <div className="mt-10">{loading ? <div className="glass-panel p-10 text-center text-slate-400">Đang tải phòng...</div> : rooms.length ? <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">{rooms.map((room) => <RoomCard key={room.id} room={room} />)}</div> : <EmptyState title="Không tìm thấy phòng phù hợp" description="Hãy thử đổi cơ sở, danh mục hoặc ngày lưu trú." />}</div>
    </div>
  );
}
