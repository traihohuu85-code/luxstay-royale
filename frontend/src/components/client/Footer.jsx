import { Crown, MapPin, Phone, Mail, Sparkles } from "lucide-react";
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-slate-950 text-white">
      <div className="absolute inset-0 opacity-40 [background:radial-gradient(circle_at_20%_20%,rgba(245,158,11,.16),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,.14),transparent_24%)]" />
      <div className="container-lux relative grid gap-10 py-14 md:grid-cols-[1.4fr_0.7fr_0.9fr]">
        <div>
          <div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-gradient text-slate-950"><Crown fill="currentColor" /></span><div><p className="font-display text-3xl font-bold">LuxStay Royale</p><p className="text-xs font-black uppercase tracking-[0.35em] text-amber-200">Luxury Hotel Booking</p></div></div>          
        </div>
        <div>
          <h3 className="mb-4 font-black text-amber-100">Điều hướng</h3>
          <div className="grid gap-3 text-sm font-semibold text-slate-400">
            <Link className="hover:text-amber-200" to="/rooms">Danh sách phòng</Link>
            <Link className="hover:text-amber-200" to="/branches">Hệ thống cơ sở</Link>
            <Link className="hover:text-amber-200" to="/bookings">Lịch sử đặt phòng</Link>
            <Link className="hover:text-amber-200" to="/admin/dashboard">Trang quản trị</Link>
          </div>
        </div>
        <div>
          <h3 className="mb-4 font-black text-amber-100">Liên hệ</h3>
          <div className="grid gap-3 text-sm text-slate-400">
            <p className="flex gap-3"><MapPin size={18} className="text-amber-200" />15 Tràng Tiền, Hoàn Kiếm, Hà Nội</p>
            <p className="flex gap-3"><Phone size={18} className="text-amber-200" />0778502723</p>
            <p className="flex gap-3"><Mail size={18} className="text-amber-200" />booking@luxstay.vn</p>
          </div>
        </div>
      </div>
      <div className="relative border-t border-white/10 py-5 text-center text-sm text-slate-500">© 2026 LuxStay Royale. Merged Premium Edition.</div>
    </footer>
  );
}
