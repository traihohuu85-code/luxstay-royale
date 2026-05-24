import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Building2, CalendarDays, Crown, Gem, Search, ShieldCheck, Sparkles, Star, Users } from 'lucide-react';
import http from '../../api/http';
import BranchCard from '../../components/client/BranchCard';
import RoomCard from '../../components/client/RoomCard';
import { formatCurrency } from '../../utils/format';

export default function HomePage() {
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ branchId: '', checkInDate: '', checkOutDate: '', capacity: 2, keyword: '' });

  useEffect(() => {
    Promise.all([http.get('/branches'), http.get('/rooms?status=available'), http.get('/categories')]).then(([branchRes, roomRes, catRes]) => {
      setBranches(branchRes.data);
      setRooms(roomRes.data);
      setCategories(catRes.data);
    });
  }, []);

  const featuredRooms = useMemo(() => rooms.filter((room) => room.featured).slice(0, 6), [rooms]);
  const minPrice = useMemo(() => rooms.length ? Math.min(...rooms.map((room) => room.price)) : 0, [rooms]);

  const submit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(form).forEach(([key, value]) => value && params.set(key, value));
    navigate(`/rooms?${params.toString()}`);
  };

  return (
    <div className="overflow-hidden">
      <section className="relative min-h-[780px] overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=2100&q=90" alt="Luxury hotel" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/88 to-slate-950/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
        </div>
        <div className="container-lux relative grid min-h-[780px] items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-amber-300/25 bg-amber-300/10 px-4 py-2 text-sm font-black text-amber-100 backdrop-blur-xl"><Crown size={18} fill="currentColor" />Luxury merged edition</div>
            <h1 className="font-display text-5xl font-semibold leading-[0.92] tracking-[-0.03em] text-white md:text-7xl">Trải nghiệm đỉnh cao của sự sang trọng và tiện nghi</h1>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row"><Link to="/rooms" className="btn-primary">Khám phá phòng <ArrowRight size={18} /></Link><Link to="/branches" className="btn-secondary">Xem cơ sở</Link></div>
            <div className="mt-12 grid max-w-2xl gap-4 sm:grid-cols-3">
              {[['6+', 'Cơ sở nổi bật'], [rooms.length || '17+', 'Phòng cao cấp'], ['24/7', 'Hỗ trợ booking']].map(([value, label]) => <div key={label} className="glass-panel p-5"><p className="font-display text-3xl font-bold text-amber-200">{value}</p><p className="mt-1 text-sm text-slate-400">{label}</p></div>)}
            </div>
          </div>
          <div className="relative">
            <form onSubmit={submit} className="glass-panel p-5 md:p-8">
              <div className="mb-6"><p className="section-kicker">Tìm phòng</p><h2 className="mt-2 font-display text-3xl font-bold text-white">Lựa chọn kỳ nghỉ</h2><p className="mt-2 text-sm leading-6 text-slate-400">Chọn cơ sở, ngày lưu trú và số khách để lọc phòng còn trống.</p></div>
              <div className="grid gap-4">
                <label className="label-lux"><Building2 className="mr-2 inline text-amber-200" size={16} />Cơ sở<select className="client-input mt-2" value={form.branchId} onChange={(e) => setForm({ ...form, branchId: e.target.value })}><option value="">Tất cả cơ sở</option>{branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}</select></label>
                <label className="label-lux"><Search className="mr-2 inline text-amber-200" size={16} />Từ khóa<input className="client-input mt-2" placeholder="Tên phòng, thành phố, mô tả..." value={form.keyword} onChange={(e) => setForm({ ...form, keyword: e.target.value })} /></label>
                <div className="grid gap-4 sm:grid-cols-2"><label className="label-lux"><CalendarDays className="mr-2 inline text-amber-200" size={16} />Ngày đến<label className="relative mt-2 block"><CalendarDays className="pointer-events-none absolute right-4 top-1/2 z-10 -translate-y-1/2 text-amber-300" size={18} /><input className="client-input date-gold pr-12 [color-scheme:dark]" type="date" value={form.checkInDate || ''} onChange={(e) => setForm({ ...form, checkInDate: e.target.value })} /></label></label><label className="label-lux"><CalendarDays className="mr-2 inline text-amber-200" size={16} />Ngày đi<label className="relative mt-2 block"><CalendarDays className="pointer-events-none absolute right-4 top-1/2 z-10 -translate-y-1/2 text-amber-300" size={18} /><input className="client-input date-gold pr-12 [color-scheme:dark]" type="date" value={form.checkOutDate || ''} onChange={(e) => setForm({ ...form, checkOutDate: e.target.value })} /></label></label></div>
                <label className="label-lux"><Users className="mr-2 inline text-amber-200" size={16} />Số khách<input className="client-input mt-2" type="number" min="1" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} /></label>
                <button className="btn-primary w-full">Tìm phòng phù hợp</button>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3 text-sm"><div className="rounded-2xl bg-white/10 p-4"><p className="text-slate-400">Giá từ</p><p className="font-black text-amber-100">{formatCurrency(minPrice)}</p></div><div className="rounded-2xl bg-white/10 p-4"><p className="text-slate-400">Loại phòng</p><p className="font-black text-amber-100">{categories.length} danh mục</p></div></div>
            </form>
            <div className="pointer-events-none absolute -right-8 -top-8 hidden h-28 w-28 rounded-full bg-amber-300/25 blur-3xl lg:block" />
          </div>
        </div>
      </section>

      <section className="container-lux py-16">

      </section>

      <section className="container-lux py-10">
        <div className="mb-8 flex items-end justify-between gap-4"><div><p className="section-kicker">Cơ sở nổi bật</p><h2 className="section-title mt-3">Nhiều điểm đến tại Việt Nam</h2></div><Link to="/branches" className="hidden font-black text-amber-200 hover:text-amber-100 md:block">Xem tất cả →</Link></div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{branches.slice(0, 6).map((branch) => <BranchCard key={branch.id} branch={branch} />)}</div>
      </section>

      <section className="container-lux py-16">
        <div className="mb-8"><p className="section-kicker">Luxury rooms</p><h2 className="section-title mt-3">Bộ sưu tập phòng được yêu thích</h2></div>
        <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">{featuredRooms.map((room) => <RoomCard key={room.id} room={room} />)}</div>
      </section>
    </div>
  );
}
