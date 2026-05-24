const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const DB_PATH = path.join(__dirname, 'db.json');

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

function readDb() {
  const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  db.reviews = db.reviews || [];
  return db;
}

function writeDb(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
}

function nextId(items) {
  return items.length ? Math.max(...items.map(item => Number(item.id))) + 1 : 1;
}

function publicUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
}

function migratePasswords() {
  const db = readDb();
  let changed = false;
  db.users = db.users.map(user => {
    if (!String(user.password).startsWith('$2')) {
      changed = true;
      return { ...user, password: bcrypt.hashSync(user.password, 10) };
    }
    return user;
  });
  if (changed) writeDb(db);
}

migratePasswords();

function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Bạn cần đăng nhập.' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const db = readDb();
    const user = db.users.find(item => item.id === payload.id);
    if (!user) return res.status(401).json({ message: 'Tài khoản không tồn tại.' });
    req.user = publicUser(user);
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
  }
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Bạn không có quyền admin.' });
  }
  next();
}

function daysBetween(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

function overlaps(aStart, aEnd, bStart, bEnd) {
  return new Date(aStart) < new Date(bEnd) && new Date(aEnd) > new Date(bStart);
}

function isRoomAvailable(db, roomId, checkInDate, checkOutDate) {
  if (!checkInDate || !checkOutDate) return true;
  return !db.bookings.some(booking =>
    booking.roomId === Number(roomId) &&
    ['pending', 'confirmed', 'checked-in'].includes(booking.status) &&
    overlaps(checkInDate, checkOutDate, booking.checkInDate, booking.checkOutDate)
  );
}

function enrichRoom(db, room) {
  const roomReviews = (db.reviews || []).filter(review => review.roomId === room.id);
  const reviewCount = roomReviews.length;
  const ratingAverage = reviewCount
    ? Number((roomReviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviewCount).toFixed(1))
    : 0;

  return {
    ...room,
    branch: db.branches.find(branch => branch.id === room.branchId) || null,
    category: db.categories.find(category => category.id === room.categoryId) || null,
    reviewCount,
    ratingAverage
  };
}

function enrichBooking(db, booking) {
  const room = db.rooms.find(item => item.id === booking.roomId);
  const user = db.users.find(item => item.id === booking.userId);
  return {
    ...booking,
    room: room ? enrichRoom(db, room) : null,
    user: user ? publicUser(user) : null
  };
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, name: 'LuxStay Grand API', time: new Date().toISOString() });
});

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password || !phone) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ họ tên, email, mật khẩu và số điện thoại.' });
  }
  const db = readDb();
  const existed = db.users.find(user => user.email.toLowerCase() === email.toLowerCase());
  if (existed) return res.status(409).json({ message: 'Email đã được sử dụng.' });
  const user = {
    id: nextId(db.users),
    name,
    email,
    password: await bcrypt.hash(password, 10),
    role: 'client',
    phone,
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
    createdAt: new Date().toISOString()
  };
  db.users.push(user);
  writeDb(db);
  res.status(201).json({ accessToken: signToken(user), user: publicUser(user) });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const db = readDb();
  const user = db.users.find(item => item.email.toLowerCase() === String(email).toLowerCase());
  if (!user) return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
  res.json({ accessToken: signToken(user), user: publicUser(user) });
});

app.get('/api/auth/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

app.get('/api/branches', (req, res) => {
  const db = readDb();
  res.json(db.branches);
});

app.get('/api/branches/:id', (req, res) => {
  const db = readDb();
  const branch = db.branches.find(item => item.id === Number(req.params.id));
  if (!branch) return res.status(404).json({ message: 'Không tìm thấy cơ sở.' });
  const rooms = db.rooms.filter(room => room.branchId === branch.id).map(room => enrichRoom(db, room));
  res.json({ ...branch, rooms });
});

app.get('/api/categories', (req, res) => {
  const db = readDb();
  res.json(db.categories);
});

app.get('/api/rooms', (req, res) => {
  const db = readDb();
  const { branchId, categoryId, keyword, minPrice, maxPrice, status, capacity, checkInDate, checkOutDate } = req.query;
  let rooms = [...db.rooms];
  if (branchId) rooms = rooms.filter(room => room.branchId === Number(branchId));
  if (categoryId) rooms = rooms.filter(room => room.categoryId === Number(categoryId));
  if (status) rooms = rooms.filter(room => room.status === status);
  if (capacity) rooms = rooms.filter(room => Number(room.capacity || 1) >= Number(capacity));
  if (minPrice) rooms = rooms.filter(room => room.price >= Number(minPrice));
  if (maxPrice) rooms = rooms.filter(room => room.price <= Number(maxPrice));
  if (keyword) {
    const key = String(keyword).toLowerCase();
    rooms = rooms.filter(room =>
      room.name.toLowerCase().includes(key) ||
      room.roomNumber.toLowerCase().includes(key) ||
      room.description.toLowerCase().includes(key)
    );
  }
  rooms = rooms.filter(room => isRoomAvailable(db, room.id, checkInDate, checkOutDate));
  res.json(rooms.map(room => enrichRoom(db, room)));
});

app.get('/api/rooms/:id', (req, res) => {
  const db = readDb();
  const room = db.rooms.find(item => item.id === Number(req.params.id));
  if (!room) return res.status(404).json({ message: 'Không tìm thấy phòng.' });
  res.json(enrichRoom(db, room));
});

app.get('/api/rooms/:id/reviews', (req, res) => {
  const db = readDb();
  const roomId = Number(req.params.id);
  const room = db.rooms.find(item => item.id === roomId);
  if (!room) return res.status(404).json({ message: 'Không tìm thấy phòng.' });

  const reviews = (db.reviews || [])
    .filter(review => review.roomId === roomId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map(review => {
      const user = db.users.find(item => item.id === review.userId);
      return {
        ...review,
        user: user ? { id: user.id, name: user.name, avatar: user.avatar } : null
      };
    });

  res.json(reviews);
});

app.post('/api/rooms/:id/reviews', authenticate, (req, res) => {
  const db = readDb();
  const roomId = Number(req.params.id);
  const { rating, comment } = req.body;
  const room = db.rooms.find(item => item.id === roomId);

  if (!room) return res.status(404).json({ message: 'Không tìm thấy phòng.' });

  const numericRating = Number(rating);

  if (!numericRating || numericRating < 1 || numericRating > 5) {
    return res.status(400).json({ message: 'Vui lòng chọn số sao từ 1 đến 5.' });
  }

  if (!comment || String(comment).trim().length < 10) {
    return res.status(400).json({ message: 'Feedback cần tối thiểu 10 ký tự.' });
  }

  const eligibleBooking = db.bookings.find(booking =>
    booking.userId === req.user.id &&
    booking.roomId === roomId &&
    booking.status === 'checked-out'
  );

  if (!eligibleBooking) {
    return res.status(403).json({ message: 'Bạn chỉ có thể đánh giá phòng sau khi đã check-out.' });
  }

  const existed = (db.reviews || []).find(review =>
    review.userId === req.user.id &&
    review.roomId === roomId
  );

  if (existed) {
    return res.status(409).json({ message: 'Bạn đã đánh giá phòng này rồi.' });
  }

  const review = {
    id: nextId(db.reviews),
    roomId,
    userId: req.user.id,
    bookingId: eligibleBooking.id,
    rating: numericRating,
    comment: String(comment).trim(),
    createdAt: new Date().toISOString()
  };

  db.reviews.push(review);
  writeDb(db);

  const user = db.users.find(item => item.id === review.userId);

  res.status(201).json({
    ...review,
    user: user ? { id: user.id, name: user.name, avatar: user.avatar } : null
  });
});

app.get('/api/bookings/my', authenticate, (req, res) => {
  const db = readDb();
  const bookings = db.bookings
    .filter(booking => booking.userId === req.user.id)
    .sort((a, b) => b.id - a.id)
    .map(booking => enrichBooking(db, booking));
  res.json(bookings);
});

app.post('/api/bookings', authenticate, (req, res) => {
  const { roomId, checkInDate, checkOutDate, guestName, guestPhone, paymentMethod, note } = req.body;
  const db = readDb();
  const room = db.rooms.find(item => item.id === Number(roomId));
  if (!room) return res.status(404).json({ message: 'Không tìm thấy phòng.' });
  if (room.status === 'maintenance') return res.status(400).json({ message: 'Phòng đang bảo trì.' });
  if (!checkInDate || !checkOutDate) return res.status(400).json({ message: 'Vui lòng chọn ngày nhận và trả phòng.' });
  const nights = daysBetween(checkInDate, checkOutDate);
  if (nights <= 0) return res.status(400).json({ message: 'Ngày trả phòng phải sau ngày nhận phòng.' });
  if (!isRoomAvailable(db, room.id, checkInDate, checkOutDate)) {
    return res.status(409).json({ message: 'Phòng đã có người đặt trong khoảng thời gian này.' });
  }
  const serviceFee = Math.round(room.price * nights * 0.08);
  const booking = {
    id: nextId(db.bookings),
    userId: req.user.id,
    roomId: room.id,
    checkInDate,
    checkOutDate,
    nights,
    totalPrice: room.price * nights + serviceFee,
    serviceFee,
    status: 'pending',
    paymentStatus: paymentMethod === 'pay_later' ? 'unpaid' : 'paid',
    paymentMethod: paymentMethod || 'fake_card',
    guestName: guestName || req.user.name,
    guestPhone: guestPhone || req.user.phone,
    note: note || '',
    createdAt: new Date().toISOString()
  };
  db.bookings.push(booking);
  writeDb(db);
  res.status(201).json(enrichBooking(db, booking));
});

app.patch('/api/bookings/:id/cancel', authenticate, (req, res) => {
  const db = readDb();
  const booking = db.bookings.find(item => item.id === Number(req.params.id));
  if (!booking) return res.status(404).json({ message: 'Không tìm thấy đơn đặt phòng.' });
  if (booking.userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Bạn không có quyền hủy đơn này.' });
  }
  if (!['pending', 'confirmed'].includes(booking.status)) {
    return res.status(400).json({ message: 'Chỉ có thể hủy đơn đang chờ hoặc đã xác nhận.' });
  }
  booking.status = 'cancelled';
  booking.cancelledAt = new Date().toISOString();
  writeDb(db);
  res.json(enrichBooking(db, booking));
});

// Admin APIs
app.get('/api/admin/dashboard', authenticate, requireAdmin, (req, res) => {
  const db = readDb();
  const revenue = db.bookings
    .filter(item => item.status === 'checked-out')
    .reduce((sum, item) => sum + Number(item.totalPrice || 0), 0);
  res.json({
    branches: db.branches.length,
    categories: db.categories.length,
    rooms: db.rooms.length,
    users: db.users.length,
    bookings: db.bookings.length,
    pendingBookings: db.bookings.filter(item => item.status === 'pending').length,
    revenue,
    latestBookings: db.bookings.slice(-6).reverse().map(item => enrichBooking(db, item))
  });
});

function adminCrud(resource) {
  app.get(`/api/admin/${resource}`, authenticate, requireAdmin, (req, res) => {
    const db = readDb();
    const rows = db[resource] || [];
    if (resource === 'users') return res.json(rows.map(publicUser));
    if (resource === 'rooms') return res.json(rows.map(room => enrichRoom(db, room)));
    if (resource === 'bookings') return res.json(rows.map(booking => enrichBooking(db, booking)).sort((a, b) => b.id - a.id));
    res.json(rows);
  });

  app.post(`/api/admin/${resource}`, authenticate, requireAdmin, async (req, res) => {
    const db = readDb();
    if (!db[resource]) return res.status(404).json({ message: 'Resource không tồn tại.' });
    const item = { id: nextId(db[resource]), ...req.body, createdAt: new Date().toISOString() };
    if (resource === 'users') {
      if (!item.email || !item.password) return res.status(400).json({ message: 'Email và mật khẩu là bắt buộc.' });
      const existed = db.users.find(user => user.email.toLowerCase() === item.email.toLowerCase());
      if (existed) return res.status(409).json({ message: 'Email đã tồn tại.' });
      item.password = await bcrypt.hash(item.password, 10);
      item.role = item.role || 'client';
    }
    db[resource].push(item);
    writeDb(db);
    res.status(201).json(resource === 'users' ? publicUser(item) : item);
  });

  app.put(`/api/admin/${resource}/:id`, authenticate, requireAdmin, async (req, res) => {
    const db = readDb();
    const index = db[resource].findIndex(item => item.id === Number(req.params.id));
    if (index === -1) return res.status(404).json({ message: 'Không tìm thấy dữ liệu.' });
    const existing = db[resource][index];
    const updates = { ...req.body, updatedAt: new Date().toISOString() };
    if (resource === 'users') {
      if (updates.password) updates.password = await bcrypt.hash(updates.password, 10);
      else delete updates.password;
    }
    const updated = { ...existing, ...updates, id: existing.id };
    db[resource][index] = updated;
    writeDb(db);
    res.json(resource === 'users' ? publicUser(updated) : updated);
  });

  app.delete(`/api/admin/${resource}/:id`, authenticate, requireAdmin, (req, res) => {
    const db = readDb();
    const id = Number(req.params.id);
    const index = db[resource].findIndex(item => item.id === id);
    if (index === -1) return res.status(404).json({ message: 'Không tìm thấy dữ liệu.' });
    if (resource === 'branches' && db.rooms.some(room => room.branchId === id)) {
      return res.status(400).json({ message: 'Không thể xóa cơ sở còn phòng.' });
    }
    if (resource === 'categories' && db.rooms.some(room => room.categoryId === id)) {
      return res.status(400).json({ message: 'Không thể xóa danh mục còn phòng.' });
    }
    if (resource === 'rooms' && db.bookings.some(booking => booking.roomId === id && !['cancelled', 'checked-out'].includes(booking.status))) {
      return res.status(400).json({ message: 'Không thể xóa phòng đang có đơn đặt.' });
    }
    const [removed] = db[resource].splice(index, 1);
    writeDb(db);
    res.json({ deleted: true, item: removed });
  });
}

['branches', 'categories', 'rooms', 'users'].forEach(adminCrud);

app.get('/api/admin/bookings', authenticate, requireAdmin, (req, res) => {
  const db = readDb();
  res.json(db.bookings.map(booking => enrichBooking(db, booking)).sort((a, b) => b.id - a.id));
});

app.patch('/api/admin/bookings/:id/status', authenticate, requireAdmin, (req, res) => {
  const { status, paymentStatus } = req.body;
  const allowed = ['pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled'];
  if (status && !allowed.includes(status)) return res.status(400).json({ message: 'Trạng thái không hợp lệ.' });
  const db = readDb();
  const booking = db.bookings.find(item => item.id === Number(req.params.id));
  if (!booking) return res.status(404).json({ message: 'Không tìm thấy đơn đặt phòng.' });
  if (status) booking.status = status;
  if (paymentStatus) booking.paymentStatus = paymentStatus;
  booking.updatedAt = new Date().toISOString();

  const room = db.rooms.find(item => item.id === booking.roomId);
  if (room) {
    if (status === 'checked-in') room.status = 'occupied';
    if (['checked-out', 'cancelled'].includes(status)) room.status = 'available';
  }
  writeDb(db);
  res.json(enrichBooking(db, booking));
});

app.use((req, res) => {
  res.status(404).json({ message: 'Không tìm thấy API endpoint.' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Lỗi máy chủ.' });
});

app.listen(PORT, () => {
  console.log(`LuxStay Grand API running on http://localhost:${PORT}/api`);
});
