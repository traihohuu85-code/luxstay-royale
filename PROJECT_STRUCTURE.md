# Cấu trúc dự án

```text
luxstay-grand-complete/
├── backend/
│   ├── db.json
│   ├── package.json
│   ├── server.js
│   └── .env.example
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vercel.json
│   ├── vite.config.js
│   ├── .env.example
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── api/
│       │   └── http.js
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── layouts/
│       │   ├── ClientLayout.jsx
│       │   └── AdminLayout.jsx
│       ├── components/
│       │   ├── client/
│       │   │   ├── Navbar.jsx
│       │   │   ├── Footer.jsx
│       │   │   ├── RoomCard.jsx
│       │   │   └── BranchCard.jsx
│       │   └── common/
│       │       ├── ProtectedRoute.jsx
│       │       ├── StatusBadge.jsx
│       │       ├── EmptyState.jsx
│       │       └── Modal.jsx
│       ├── pages/
│       │   ├── auth/
│       │   │   ├── LoginPage.jsx
│       │   │   └── RegisterPage.jsx
│       │   ├── client/
│       │   │   ├── HomePage.jsx
│       │   │   ├── BranchesPage.jsx
│       │   │   ├── RoomListPage.jsx
│       │   │   ├── RoomDetailPage.jsx
│       │   │   ├── BookingHistoryPage.jsx
│       │   │   └── PaymentPage.jsx
│       │   └── admin/
│       │       ├── AdminDashboardPage.jsx
│       │       ├── AdminBranchesPage.jsx
│       │       ├── AdminCategoriesPage.jsx
│       │       ├── AdminRoomsPage.jsx
│       │       ├── AdminBookingsPage.jsx
│       │       └── AdminUsersPage.jsx
│       └── utils/
│           └── format.js
├── README.md
├── DEPLOY.md
└── PROJECT_STRUCTURE.md
```

## Những phần đã bổ sung so với bản cũ

- Backend Express thật, có auth JWT, bcrypt, CORS và phân quyền admin.
- Dữ liệu đa cơ sở gồm Hà Nội, Đà Nẵng, Nha Trang, Sài Gòn.
- Client đầy đủ trang chủ, cơ sở, danh sách phòng, chi tiết phòng, đặt phòng, thanh toán giả lập, lịch sử booking.
- Admin đầy đủ dashboard, CRUD cơ sở, CRUD danh mục, CRUD phòng, CRUD tài khoản, quản lý đặt phòng.
- Logic trạng thái booking: pending → confirmed → checked-in → checked-out/cancelled.
- Logic phòng theo cơ sở/danh mục, lọc ngày để tránh trùng lịch đặt phòng.
- Deploy sẵn cho Render và Vercel.
