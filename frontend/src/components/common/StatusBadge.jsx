const styles = {
  available: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
  occupied: "border-rose-400/40 bg-rose-400/10 text-rose-200",
  maintenance: "border-amber-400/40 bg-amber-400/10 text-amber-200",

  pending: "border-amber-400/40 bg-amber-400/10 text-amber-200",
  confirmed: "border-sky-400/40 bg-sky-400/10 text-sky-200",
  "checked-in": "border-indigo-400/40 bg-indigo-400/10 text-indigo-200",
  "checked-out": "border-zinc-400/40 bg-zinc-400/10 text-zinc-200",
  cancelled: "border-rose-400/40 bg-rose-400/10 text-rose-200",
  paid: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
pending_payment: "border-amber-400/40 bg-amber-400/10 text-amber-200",
unpaid: "border-zinc-400/40 bg-zinc-400/10 text-zinc-200",
refunded: "border-cyan-400/40 bg-cyan-400/10 text-cyan-200",
};

const statusLabel = {
  available: "Còn phòng",
  occupied: "Đang sử dụng",
  maintenance: "Bảo trì",

  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  "checked-in": "Đã check-in",
  "checked-out": "Đã check-out",
  cancelled: "Đã hủy",

  paid: "Đã thanh toán",
pending_payment: "Chờ thanh toán",
unpaid: "Chưa thanh toán",
refunded: "Đã hoàn tiền",
};

export default function StatusBadge({ value, status, children }) {
  const current = value || status || children || "pending";

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold shadow-sm ${
        styles[current] || styles.pending
      }`}
    >
      {statusLabel[current] || current}
    </span>
  );
}