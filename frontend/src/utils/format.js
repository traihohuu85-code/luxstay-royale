export const formatCurrency = (value) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(value || 0));

export const formatDate = (value) =>
  value ? new Intl.DateTimeFormat('vi-VN').format(new Date(value)) : '—';

export const nightsBetween = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
};

export const statusLabel = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  'checked-in': 'Đã check-in',
  'checked-out': 'Đã check-out',
  cancelled: 'Đã hủy',
  available: 'Còn phòng',
  occupied: 'Đang sử dụng',
  maintenance: 'Bảo trì',
  paid: 'Đã thanh toán',
  unpaid: 'Chưa thanh toán'
};
