import { Crown, LockKeyhole, Mail, Phone, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const submit = async (e) => { e.preventDefault(); setError(''); try { await register(form); navigate('/'); } catch (err) { setError(err.message); } };
  return <div className="grid min-h-[calc(100vh-80px)] place-items-center px-4 py-16"><div className="w-full max-w-md glass-panel p-8"><div className="mb-6 flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-gradient text-slate-950"><Crown fill="currentColor" /></span><div><p className="font-display text-2xl font-bold text-white">LuxStay Royale</p><p className="text-xs font-black uppercase tracking-[0.25em] text-amber-200">Create account</p></div></div><h1 className="font-display text-4xl font-bold text-white">Tạo tài khoản</h1><p className="mt-2 text-slate-400">Đăng ký để đặt phòng và xem lịch sử.</p><form onSubmit={submit} className="mt-6 grid gap-4">{error && <div className="rounded-2xl border border-red-300/20 bg-red-500/10 p-3 text-sm font-bold text-red-100">{error}</div>}<Input icon={UserRound} placeholder="Họ tên" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /><Input icon={Mail} type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /><Input icon={Phone} placeholder="Số điện thoại" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /><Input icon={LockKeyhole} type="password" placeholder="Mật khẩu" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /><button disabled={loading} className="btn-primary w-full">{loading ? 'Đang xử lý...' : 'Đăng ký'}</button><p className="text-center text-sm text-slate-400">Đã có tài khoản? <Link className="font-black text-amber-200 hover:text-amber-100" to="/login">Đăng nhập</Link></p></form></div></div>;
}
function Input({ icon: Icon, ...props }) { return <label className="relative"><Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-200" size={18} /><input className="client-input pl-11" {...props} /></label>; }
