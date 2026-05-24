import { Crown, LockKeyhole, Mail } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: 'admin@luxstay.vn', password: 'Admin@123' });
  const [error, setError] = useState('');
  const submit = async (e) => { e.preventDefault(); setError(''); try { const user = await login(form); navigate(user.role === 'admin' ? '/admin/dashboard' : (location.state?.from || '/')); } catch (err) { setError(err.message); } };
  return <AuthShell title="Đăng nhập" subtitle="Truy cập tài khoản LuxStay Royale"><form onSubmit={submit} className="grid gap-4">{error && <div className="rounded-2xl border border-red-300/20 bg-red-500/10 p-3 text-sm font-bold text-red-100">{error}</div>}<label className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-200" size={18} /><input className="client-input pl-11" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label><label className="relative"><LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-200" size={18} /><input className="client-input pl-11" type="password" placeholder="Mật khẩu" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label><button disabled={loading} className="btn-primary w-full">{loading ? 'Đang xử lý...' : 'Đăng nhập'}</button><p className="text-center text-sm text-slate-400">Chưa có tài khoản? <Link className="font-black text-amber-200 hover:text-amber-100" to="/register">Đăng ký</Link></p></form></AuthShell>;
}

function AuthShell({ title, subtitle, children }) { return <div className="grid min-h-[calc(100vh-80px)] place-items-center px-4 py-16"><div className="w-full max-w-md glass-panel p-8"><div className="mb-6 flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-gradient text-slate-950"><Crown fill="currentColor" /></span><div><p className="font-display text-2xl font-bold text-white">LuxStay Royale</p><p className="text-xs font-black uppercase tracking-[0.25em] text-amber-200">Premium access</p></div></div><h1 className="font-display text-4xl font-bold text-white">{title}</h1><p className="mt-2 text-slate-400">{subtitle}</p><div className="mt-6">{children}</div><div className="mt-6 rounded-2xl border border-white/10 bg-white/10 p-4 text-xs leading-6 text-slate-400"><b className="text-amber-200">Demo:</b> admin@luxstay.vn / Admin@123 hoặc khach@luxstay.vn / Khach@123</div></div></div>; }
