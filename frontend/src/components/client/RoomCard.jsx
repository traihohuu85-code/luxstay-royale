import { Link } from 'react-router-dom';
import { BedDouble, MapPin, Maximize2, Star, Users } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { formatCurrency } from '../../utils/format';

export default function RoomCard({ room }) {
  return (
    <Link to={`/rooms/${room.id}`} className="group block overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.075] shadow-luxury backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-amber-300/40 hover:bg-white/[0.1]">
      <div className="relative h-72 overflow-hidden">
        <img src={room.images?.[0]} alt={room.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        <div className="absolute left-4 top-4"><StatusBadge value={room.status} /></div>
        {room.featured && <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-gold-gradient px-3 py-1 text-xs font-black text-slate-950 shadow-gold"><Star size={13} fill="currentColor" />Nổi bật</div>}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
          <p className="rounded-full border border-white/10 bg-slate-950/65 px-3 py-1 text-xs font-black uppercase tracking-widest text-amber-100 backdrop-blur">{room.category?.name}</p>
          <p className="rounded-full border border-white/10 bg-slate-950/65 px-3 py-1 text-xs font-bold text-slate-200 backdrop-blur">#{room.roomNumber}</p>
        </div>
      </div>
      <div className="p-6">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-400"><MapPin size={16} className="text-amber-200" />{room.branch?.city || room.branch?.name}</div>
        <h3 className="font-display text-2xl font-bold leading-tight text-white">{room.name}</h3>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-400">{room.description}</p>
        <div className="mt-5 grid grid-cols-3 gap-2 text-xs font-bold text-slate-300">
          <span className="rounded-2xl bg-white/10 px-3 py-2"><Users className="mr-1 inline text-amber-200" size={14} />{room.capacity}</span>
          <span className="rounded-2xl bg-white/10 px-3 py-2"><Maximize2 className="mr-1 inline text-amber-200" size={14} />{room.area}m²</span>
          <span className="rounded-2xl bg-white/10 px-3 py-2"><BedDouble className="mr-1 inline text-amber-200" size={14} />{String(room.bedType || '').split(' ')[0]}</span>
        </div>
        <div className="mt-6 flex items-end justify-between gap-4 border-t border-white/10 pt-5">
          <div><p className="text-xs text-slate-500">Giá từ</p><p className="text-xl font-black text-amber-100">{formatCurrency(room.price)}<span className="text-xs font-semibold text-slate-500">/đêm</span></p></div>
          <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-slate-950 transition group-hover:bg-amber-300">Chi tiết</span>
        </div>
      </div>
    </Link>
  );
}
