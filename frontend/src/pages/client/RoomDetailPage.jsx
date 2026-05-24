import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Bath, BedDouble, CalendarDays, CreditCard, MapPin, Maximize2, MessageCircle, Phone, Star, UserRound, Users } from 'lucide-react';
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
  const [form, setForm] = useState({ checkInDate: '', checkOutDate: '', guestName: user?.name || '', guestPhone: user?.phone || '', paymentMethod: 'qr_transfer', note: '' });
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewMessage, setReviewMessage] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => { http.get(`/rooms/${id}`).then((res) => { setRoom(res.data); setMainImage(res.data.images?.[0]); }); }, [id]);
  const loadReviews = () => http.get(`/rooms/${id}/reviews`).then((res) => setReviews(res.data));

  useEffect(() => {
    loadReviews();
  }, [id]);
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
  const submitReview = async (e) => {
    e.preventDefault();
    setReviewMessage('');

    if (!user) {
     return navigate('/login', { state: { from: `/rooms/${id}` } });
    }

    setReviewSubmitting(true);

    try {
      await http.post(`/rooms/${room.id}/reviews`, reviewForm);
      setReviewForm({ rating: 5, comment: '' });
      setReviewMessage('Cảm ơn bạn! Feedback đã được gửi thành công.');
      await loadReviews();
    } catch (err) {
      setReviewMessage(err.message);
    } finally {
      setReviewSubmitting(false);
    }
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
            <FeedbackSection
              reviews={reviews}
              reviewForm={reviewForm}
              setReviewForm={setReviewForm}
              submitReview={submitReview}
              reviewMessage={reviewMessage}
              reviewSubmitting={reviewSubmitting}
              user={user}
            />
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
            <label className="label-lux"><CreditCard className="mr-2 inline text-amber-200" size={16} />Thanh toán<select className="client-input mt-2" value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}><option value="qr_transfer">Thanh toán QR / chuyển khoản</option><option value="pay_at_hotel">Thanh toán tại khách sạn</option></select></label>{form.paymentMethod === 'qr_transfer' && <div className="sm:col-span-2 rounded-3xl border border-amber-300/20 bg-amber-300/10 p-5"><p className="text-sm font-black text-amber-100">Quét QR để thanh toán</p><div className="mt-4 grid gap-4 sm:grid-cols-[180px_1fr]"><div className="grid place-items-center rounded-3xl bg-white p-3 shadow-lg"><img src={`https://img.vietqr.io/image/MB-0778502723-compact2.png?amount=${total}&addInfo=${encodeURIComponent(`DATPHONG ${room?.id} ${user?.id || 'KHACH'}`)}&accountName=${encodeURIComponent('NGUYEN HUU MANH')}`} alt="QR thanh toán" className="h-40 w-40 rounded-2xl object-contain" /></div><div className="space-y-2 text-sm text-slate-300"><p>Ngân hàng: <span className="font-bold text-white">MB Bank</span></p><p>Số tài khoản: <span className="font-bold text-white">0778502723</span></p><p>Chủ tài khoản: <span className="font-bold text-white">NGUYEN HUU MANH</span></p><p>Nội dung: <span className="font-bold text-amber-100">DATPHONG {room?.id} {user?.id || 'KHACH'}</span></p></div></div></div>}
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
function FeedbackSection({ reviews, reviewForm, setReviewForm, submitReview, reviewMessage, reviewSubmitting, user }) {
  const average = reviews.length
    ? (reviews.reduce((sum, item) => sum + Number(item.rating || 0), 0) / reviews.length).toFixed(1)
    : '0.0';

  return (
    <div className="mt-8 glass-panel p-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-kicker">Feedback</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-white">Đánh giá từ khách hàng</h2>
          <p className="mt-2 text-sm text-slate-400">
            Chỉ khách đã check-out mới có thể gửi feedback cho phòng.
          </p>
        </div>

        <div className="rounded-3xl border border-amber-300/20 bg-amber-300/10 px-5 py-4 text-right">
          <p className="text-3xl font-black text-amber-100">{average}/5</p>
          <p className="text-xs font-bold text-slate-400">{reviews.length} đánh giá</p>
        </div>
      </div>

      <form onSubmit={submitReview} className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                className="transition hover:scale-110"
              >
                <Star
                  size={24}
                  className={star <= reviewForm.rating ? 'fill-amber-300 text-amber-300' : 'text-slate-600'}
                />
              </button>
            ))}
          </div>

          <span className="text-sm font-bold text-slate-400">
            {user ? 'Viết cảm nhận của bạn' : 'Đăng nhập để gửi feedback'}
          </span>
        </div>

        <textarea
          className="client-input mt-4"
          rows="4"
          placeholder="Ví dụ: Phòng sạch, view đẹp, nhân viên hỗ trợ tốt..."
          value={reviewForm.comment}
          onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
        />

        {reviewMessage && (
          <p className="mt-3 text-sm font-bold text-amber-100">{reviewMessage}</p>
        )}

        <button disabled={reviewSubmitting} className="btn-primary mt-4 w-full">
          {reviewSubmitting ? 'Đang gửi...' : 'Gửi feedback'}
        </button>
      </form>

      <div className="mt-6 space-y-4">
        {reviews.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-400">
            <MessageCircle className="mb-3 text-amber-200" />
            Chưa có feedback nào cho phòng này.
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-black text-white">{review.user?.name || 'Khách hàng'}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>

                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={star <= review.rating ? 'fill-amber-300 text-amber-300' : 'text-slate-600'}
                    />
                  ))}
                </div>
              </div>

              <p className="mt-4 leading-7 text-slate-300">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
