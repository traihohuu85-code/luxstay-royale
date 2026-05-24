# Hướng dẫn deploy public lên Render + Vercel

## 1. Đẩy code lên GitHub

```bash
git init
git add .
git commit -m "complete hotel booking project"
git branch -M main
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main
```

## 2. Deploy Backend lên Render

1. Vào Render.com → **New** → **Web Service**.
2. Kết nối GitHub repository.
3. Chọn cấu hình:
   - Root Directory: `backend`
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Thêm Environment Variables:
   - `NODE_ENV=production`
   - `JWT_SECRET=your_long_random_secret`
   - `FRONTEND_URL=https://ten-du-an.vercel.app`
5. Deploy xong, Render sẽ cấp API URL, ví dụ:
   `https://luxstay-grand-api.onrender.com/api`

Kiểm tra API:

```bash
https://luxstay-grand-api.onrender.com/api/health
https://luxstay-grand-api.onrender.com/api/rooms
```

## 3. Cấu hình Frontend gọi API public

Trong Vercel hoặc file `.env` local của frontend:

```env
VITE_API_BASE_URL=https://luxstay-grand-api.onrender.com/api
```

## 4. Deploy Frontend lên Vercel

1. Vào Vercel.com → **Add New Project**.
2. Import GitHub repository.
3. Chọn:
   - Root Directory: `frontend`
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Thêm Environment Variable:
   - `VITE_API_BASE_URL=https://luxstay-grand-api.onrender.com/api`
5. Deploy.

## 5. Checklist trước khi nộp bài

- Mở được trang chủ public.
- Đăng ký/đăng nhập được.
- Lọc phòng theo cơ sở và danh mục.
- Đặt phòng và thanh toán giả lập được.
- Admin đăng nhập và CRUD phòng được.
- Admin cập nhật trạng thái booking check-in/check-out được.
