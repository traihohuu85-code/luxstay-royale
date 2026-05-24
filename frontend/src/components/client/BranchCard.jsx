import { ArrowRight, MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BranchCard({ branch }) {
  return (
    <Link to={`/rooms?branchId=${branch.id}`} className="group relative min-h-[360px] overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900 shadow-luxury">
      <img src={branch.image} alt={branch.name} className="absolute inset-0 h-full w-full object-cover opacity-75 transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent" />
      <div className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-black text-white backdrop-blur-xl"><Star size={13} fill="currentColor" className="text-amber-200" />{branch.rating}</div>
      <div className="relative flex min-h-[360px] flex-col justify-end p-6 text-white">
        <p className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-bold text-amber-100 backdrop-blur"><MapPin size={14} />{branch.city}</p>
        <h3 className="font-display text-3xl font-bold leading-tight">{branch.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-300">{branch.description || branch.address}</p>
        <div className="mt-5 inline-flex items-center gap-2 text-sm font-black text-amber-200">Xem phòng <ArrowRight size={16} className="transition group-hover:translate-x-1" /></div>
      </div>
    </Link>
  );
}
