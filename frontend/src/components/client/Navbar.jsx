import { useState } from 'react';
import { Crown, History, Home, Hotel, LogOut, Menu, ShieldCheck, UserRound, X } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/', label: 'Trang chủ', icon: Home },
  { to: '/branches', label: 'Cơ sở', icon: Hotel },
  { to: '/rooms', label: 'Phòng', icon: Crown }
];

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/'); setOpen(false); };
  const navClass = ({ isActive }) => `inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all duration-300 ${isActive ? 'bg-amber-300 text-slate-950 shadow-gold' : 'text-slate-300 hover:bg-white/10 hover:text-amber-100'}`;

  const menu = (
    <>
      {links.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} onClick={() => setOpen(false)} className={navClass}><Icon size={16} />{label}</NavLink>)}
      {user && <NavLink to="/bookings" onClick={() => setOpen(false)} className={navClass}><History size={16} />Lịch sử</NavLink>}
      {isAdmin && <NavLink to="/admin/dashboard" onClick={() => setOpen(false)} className={navClass}><ShieldCheck size={16} />Admin</NavLink>}
    </>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/78 backdrop-blur-2xl">
      <div className="container-lux flex items-center justify-between py-4">
        <Link to="/" className="group flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-gradient text-slate-950 shadow-gold transition group-hover:-rotate-6"><Crown size={24} fill="currentColor" /></span>
          <span>
            <span className="block font-display text-2xl font-bold tracking-tight text-white">LuxStay Royale</span>
            <span className="hidden text-[11px] font-black uppercase tracking-[0.35em] text-amber-200 sm:block">Merged Premium</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-2 lg:flex">{menu}</nav>
        <div className="hidden items-center gap-3 lg:flex">
          {!user ? (
            <>
              <Link to="/login" className="btn-secondary px-5 py-2.5">Đăng nhập</Link>
              <Link to="/register" className="btn-primary px-5 py-2.5">Đăng ký</Link>
            </>
          ) : (
            <>
              <div className="hidden rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold text-slate-200 xl:block"><UserRound className="mr-2 inline" size={16} />{user.name}</div>
              <button onClick={handleLogout} className="btn-secondary px-5 py-2.5 text-red-100 hover:border-red-300/50 hover:bg-red-500/10"><LogOut size={16} />Thoát</button>
            </>
          )}
        </div>
        <button onClick={() => setOpen(!open)} className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/10 text-white lg:hidden">{open ? <X /> : <Menu />}</button>
      </div>
      {open && <div className="border-t border-white/10 bg-slate-950/95 px-4 py-4 lg:hidden"><nav className="grid gap-2">{menu}</nav><div className="mt-4 grid gap-3">{!user ? <><Link onClick={() => setOpen(false)} className="btn-secondary" to="/login">Đăng nhập</Link><Link onClick={() => setOpen(false)} className="btn-primary" to="/register">Đăng ký</Link></> : <button onClick={handleLogout} className="btn-secondary">Đăng xuất</button>}</div></div>}
    </header>
  );
}
