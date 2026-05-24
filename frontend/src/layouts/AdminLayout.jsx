import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  ['dashboard', '📊', 'Tổng quan'],
  ['branches', '🏨', 'Cơ sở'],
  ['categories', '🏷️', 'Danh mục'],
  ['rooms', '🛏️', 'Phòng'],
  ['bookings', '🧾', 'Đặt phòng'],
  ['users', '👥', 'Tài khoản']
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white lg:flex">
      <aside className="sticky top-0 z-30 h-auto border-b border-white/10 bg-slate-950/95 p-4 backdrop-blur lg:h-screen lg:w-72 lg:border-b-0 lg:border-r">
        <div className="mb-8 flex items-center justify-between lg:block">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-300">Admin</p>
            <h1 className="text-2xl font-black">LuxStay Grand</h1>
          </div>
          <button onClick={() => navigate('/')} className="rounded-xl bg-white/10 px-3 py-2 text-sm hover:bg-white/20 lg:mt-5">Xem web</button>
        </div>
        <nav className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
          {links.map(([path, icon, label]) => (
            <NavLink key={path} to={`/admin/${path}`} className={({ isActive }) => `rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${isActive ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/30' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}>
              <span className="mr-2">{icon}</span>{label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm font-semibold">{user?.name}</p>
          <p className="text-xs text-slate-400">{user?.email}</p>
          <button onClick={handleLogout} className="mt-4 w-full rounded-xl bg-red-500/90 px-3 py-2 text-sm font-semibold hover:bg-red-500">Đăng xuất</button>
        </div>
      </aside>
      <section className="flex-1 overflow-x-hidden bg-slate-100 p-4 text-slate-900 md:p-8">
        <Outlet />
      </section>
    </div>
  );
}
