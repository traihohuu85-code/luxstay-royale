# LuxStay Royale – Merged Premium Hotel Booking

Đây là bản **gộp và nâng cấp** từ hai source web bạn gửi:

- Giữ backend Express + JWT + phân quyền admin từ bản `luxstay-grand-complete-fixed`.
- Kế thừa phong cách luxury/dark premium, card phòng, hero lớn và cảm giác resort cao cấp từ bản `luxstay-hotel-booking-react-jsonserver-fixed`.
- Bổ sung thêm dữ liệu cơ sở Sapa và Phú Quốc, tăng số lượng phòng, cải thiện giao diện Client và giữ đầy đủ Admin CRUD.

## Chạy nhanh

```powershell
npm install
npm start
```

Sau đó mở:

- Frontend: http://localhost:5173
- Backend: http://localhost:5000/api/health

## Tài khoản mẫu

```txt
Admin:  admin@luxstay.vn / Admin@123
Client: khach@luxstay.vn / Khach@123
```

## Chức năng chính

### Client

- Trang chủ luxury, banner lớn, form tìm kiếm phòng.
- Danh sách cơ sở đa chi nhánh.
- Danh sách phòng có lọc theo cơ sở, danh mục, ngày, số khách, giá, trạng thái, từ khóa.
- Chi tiết phòng có gallery ảnh, tiện nghi, tính tiền theo số đêm.
- Đặt phòng và thanh toán giả lập.
- Lịch sử đặt phòng và hủy đơn.

### Admin

- Dashboard tổng quan.
- Quản lý cơ sở.
- Quản lý danh mục.
- Quản lý phòng.
- Quản lý tài khoản.
- Quản lý đặt phòng, cập nhật trạng thái pending → confirmed → checked-in → checked-out/cancelled.

## Cấu trúc

```txt
luxstay-merged-premium/
├─ backend/     Express API, db.json, JWT auth
├─ frontend/    React + Tailwind CSS
├─ package.json chạy chung frontend/backend
└─ RUN_FIRST.md hướng dẫn chạy nhanh
```

## Deploy

Xem file `DEPLOY.md` để deploy backend lên Render và frontend lên Vercel.
