import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Bath, BedDouble, CalendarDays, CreditCard, MapPin, Maximize2, Phone, UserRound, Users } from 'lucide-react';
import http from '../../api/http';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, nightsBetween } from '../../utils/format';
import StatusBadge from '../../components/common/StatusBadge';

export default function RoomDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [room, setRoom] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ checkInDate: '', checkOutDate: '', guestName: user?.name || '', guestPhone: user?.phone || '', paymentMethod: 'fake_card', note: '' });

  useEffect(() => { http.get(`/rooms/${id}`).then((res) => { setRoom(res.data); setMainImage(res.data.images?.[0]); }); }, [id]);
  useEffect(() => { setForm((f) => ({ ...f, guestName: user?.name || f.guestName, guestPhone: user?.phone || f.guestPhone })); }, [user]);
  if (!room) return <div className="container-lux py-16"><div className="glass-panel p-10 text-center text-slate-400">Đang tải chi tiết phòng...</div></div>;

  const nights = nightsBetween(form.checkInDate, form.checkOutDate);
  const subtotal = nights * room.price;
  const serviceFee = Math.round(subtotal * 0.08);
  const total = subtotal + serviceFee;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!user) return navigate('/login', { state: { from: `/rooms/${id}` } });
    setSubmitting(true);
    try {
      const res = await http.post('/bookings', { ...form, roomId: room.id });
      navigate(`/payment/${res.data.id}`, { state: { booking: res.data } });
    } catch (err) { setError(err.message); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="container-lux py-12">
      <Link to="/rooms" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-amber-200"><ArrowLeft size={16} />Quay lại danh sách phòng</Link>
      <div className="grid gap-10 lg:grid-cols-[1.12fr_0.88fr]">
        <div>
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 shadow-luxury"><img src={mainImage} alt={room.name} className="h-[520px] w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" /><div className="absolute left-5 top-5"><StatusBadge value={room.status} /></div></div>
          <div className="mt-4 grid grid-cols-3 gap-4">{room.images?.map((image) => <button key={image} onClick={() => setMainImage(image)} className={`overflow-hidden rounded-2xl border transition ${mainImage === image ? 'border-amber-300' : 'border-white/10'}`}><img src={image} alt="thumb" className="h-28 w-full object-cover transition hover:scale-105" /></button>)}</div>
          <div className="mt-8 glass-panel p-7">
            <div className="flex flex-wrap items-center gap-3"><span className="pill-lux"><MapPin size={14} />{room.branch?.name}</span><span className="pill-lux">{room.category?.name}</span></div>
            <h1 className="mt-5 font-display text-4xl font-bold text-white md:text-5xl">{room.name}</h1>
            <p className="mt-5 text-lg leading-8 text-slate-300">{room.description}</p>
            <div className="mt-7 grid gap-4 sm:grid-cols-3"><Info icon={Maximize2} label="Diện tích" value={`${room.area}m²`} /><Info icon={BedDouble} label="Giường" value={room.bedType} /><Info icon={Users} label="Sức chứa" value={`${room.capacity} khách`} /></div>
            <h2 className="mt-9 font-display text-2xl font-bold text-white">Tiện nghi nổi bật</h2>
            <div className="mt-4 flex flex-wrap gap-3">{room.amenities?.map((item) => <span key={item} className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-sm font-bold text-emerald-100"><Bath size={15} />{item}</span>)}</div>
          </div>
        </div>

        <form onSubmit={submit} className="sticky top-28 h-fit glass-panel p-7">
          <p className="section-kicker">Đặt phòng</p>
          <p className="mt-3 font-display text-4xl font-bold text-amber-100">{formatCurrency(room.price)}<span className="text-sm font-medium text-slate-500">/đêm</span></p>
          {error && <div className="mt-4 rounded-2xl border border-red-300/20 bg-red-500/10 p-3 text-sm font-bold text-red-100">{error}</div>}
          <div className="mt-6 grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2"><label className="label-lux"><CalendarDays className="mr-2 inline text-amber-200" size={16} />Ngày đến<input required type="date" className="client-input mt-2" value={form.checkInDate} onChange={(e) => setForm({ ...form, checkInDate: e.target.value })} /></label><label className="label-lux">Ngày đi<input required type="date" className="client-input mt-2" value={form.checkOutDate} onChange={(e) => setForm({ ...form, checkOutDate: e.target.value })} /></label></div>
            <label className="label-lux"><UserRound className="mr-2 inline text-amber-200" size={16} />Tên khách<input required className="client-input mt-2" value={form.guestName} onChange={(e) => setForm({ ...form, guestName: e.target.value })} /></label>
            <label className="label-lux"><Phone className="mr-2 inline text-amber-200" size={16} />Số điện thoại<input required className="client-input mt-2" value={form.guestPhone} onChange={(e) => setForm({ ...form, guestPhone: e.target.value })} /></label>
            <label className="label-lux"><CreditCard className="mr-2 inline text-amber-200" size={16} />Thanh toán<select className="client-input mt-2" value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}><option value="fake_card">Thanh toán giả lập</option><option value="bank_transfer">Chuyển khoản demo</option><option value="pay_later">Thanh toán tại khách sạn</option></select></label>
            <textarea className="client-input" rows="3" placeholder="Ghi chú thêm cho khách sạn" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
          </div>
          <div className="mt-6 rounded-3xl border border-white/10 bg-white/10 p-4 text-sm">
            <PriceLine label={`${nights || 0} đêm`} value={formatCurrency(subtotal)} />
            <PriceLine label="Phí dịch vụ 8%" value={formatCurrency(serviceFee)} />
            <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-lg font-black text-white"><span>Tổng</span><span>{formatCurrency(total)}</span></div>
          </div>
          <button disabled={submitting} className="btn-primary mt-6 w-full">{submitting ? 'Đang tạo đơn...' : 'Đặt & thanh toán'}</button>
        </form>
      </div>
    </div>
  );
}

function Info({ icon: Icon, label, value }) { return <div className="rounded-2xl border border-white/10 bg-white/10 p-4"><Icon size={18} className="mb-3 text-amber-200" /><p className="text-xs text-slate-500">{label}</p><p className="mt-1 font-black text-white">{value}</p></div>; }
function PriceLine({ label, value }) { return <div className="mb-2 flex justify-between text-slate-400"><span>{label}</span><span className="font-bold text-slate-100">{value}</span></div>; }
