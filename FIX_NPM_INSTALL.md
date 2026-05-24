# Sửa lỗi npm install bị ETIMEDOUT / internal registry

Nếu npm báo lỗi `packages.applied-caas-gateway...` thì máy đang đọc `package-lock.json` cũ. Bản ZIP này đã xóa toàn bộ `package-lock.json`.

Chạy lần lượt:

```powershell
npm config set registry https://registry.npmjs.org/
npm cache clean --force
npm install --no-audit --no-fund
npm start
```

Nếu vẫn lỗi EPERM khi xóa `node_modules`, hãy đóng VS Code/terminal đang dùng dự án, xóa thủ công thư mục `node_modules`, rồi chạy lại lệnh trên.
