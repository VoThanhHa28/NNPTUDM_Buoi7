# Hướng Dẫn Test Với Postman & Chuẩn Bị Báo Cáo

## PHẦN 1: Chuẩn Bị Môi Trường

### 1.1 Cài MongoDB

- Download từ https://www.mongodb.com/try/download/community
- Cài đặt và chạy MongoDB Service
- Kiểm tra: Mở command prompt, gõ `mongosh` để kết nối

### 1.2 Cài Node.js Dependencies

```bash
cd c:\Users\USER\Downloads\NNPTUDM_Buoi7
npm install
```

### 1.3 Khởi Động Server

```bash
npm start
```

Xem output:
```
✓ MongoDB connected
🚀 Server running on http://localhost:5000
```

---

## PHẦN 2: Import Postman Collection

### 2.1 Mở Postman

- Download & cài Postman từ https://www.postman.com/downloads/

### 2.2 Import Collection

1. Mở Postman
2. Click `Import` (góc trên trái)
3. Chọn Tab `Upload Files` → Chọn file `Postman_Collection.json`
4. Click `Import`

---

## PHẦN 3: Test Các API (Theo Thứ Tự)

### **Step 1: Create Product 1**

**Request:**
```
POST http://localhost:5000/api/products
Content-Type: application/json

{
  "name": "Laptop Dell XPS 15"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Sản phẩm được tạo thành công",
  "data": {
    "product": {
      "_id": "67a4c5e1b2c3d4e5f6g7h8i9",
      "name": "Laptop Dell XPS 15",
      "createdAt": "2025-03-25T10:00:00.000Z",
      "updatedAt": "2025-03-25T10:00:00.000Z"
    },
    "inventory": {
      "_id": "67a4c5e1b2c3d4e5f6g7h8j0",
      "product": "67a4c5e1b2c3d4e5f6g7h8i9",
      "stock": 0,
      "reserved": 0,
      "soldCount": 0
    }
  }
}
```

**Lưu ý:** Copy `_id` của product để dùng trong các request tiếp theo

---

### **Step 2: Create Product 2**

**Request:**
```
POST http://localhost:5000/api/products
Content-Type: application/json

{
  "name": "iPhone 15 Pro"
}
```

---

### **Step 3: Get All Products**

**Request:**
```
GET http://localhost:5000/api/products
```

**Expected Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    { "_id": "...", "name": "Laptop Dell XPS 15", ... },
    { "_id": "...", "name": "iPhone 15 Pro", ... }
  ]
}
```

---

### **Step 4: Get All Inventories**

**Request:**
```
GET http://localhost:5000/api/inventories
```

**Expected Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "...",
      "product": {
        "_id": "67a4c5e1b2c3d4e5f6g7h8i9",
        "name": "Laptop Dell XPS 15"
      },
      "stock": 0,
      "reserved": 0,
      "soldCount": 0
    },
    {
      "_id": "...",
      "product": {
        "_id": "...",
        "name": "iPhone 15 Pro"
      },
      "stock": 0,
      "reserved": 0,
      "soldCount": 0
    }
  ]
}
```

---

### **Step 5: Add Stock cho Product 1**

**Request:**
```
POST http://localhost:5000/api/inventories/add-stock
Content-Type: application/json

{
  "product": "67a4c5e1b2c3d4e5f6g7h8i9",
  "quantity": 50
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Đã cộng 50 vào stock",
  "data": {
    "_id": "...",
    "product": {
      "_id": "67a4c5e1b2c3d4e5f6g7h8i9",
      "name": "Laptop Dell XPS 15"
    },
    "stock": 50,
    "reserved": 0,
    "soldCount": 0
  }
}
```

---

### **Step 6: Add Stock cho Product 2**

**Request:**
```
POST http://localhost:5000/api/inventories/add-stock
Content-Type: application/json

{
  "product": "<product_2_id>",
  "quantity": 100
}
```

---

### **Step 7: Reserve (Đặt hàng) từ Product 1**

**Request:**
```
POST http://localhost:5000/api/inventories/reserve
Content-Type: application/json

{
  "product": "67a4c5e1b2c3d4e5f6g7h8i9",
  "quantity": 10
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Đã đặt hàng 10 sản phẩm",
  "data": {
    "_id": "...",
    "product": { "name": "Laptop Dell XPS 15", ... },
    "stock": 40,
    "reserved": 10,
    "soldCount": 0
  }
}
```

---

### **Step 8: Sell (Bán hàng)**

**Request:**
```
POST http://localhost:5000/api/inventories/sell
Content-Type: application/json

{
  "product": "67a4c5e1b2c3d4e5f6g7h8i9",
  "quantity": 5
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Đã bán 5 sản phẩm",
  "data": {
    "_id": "...",
    "product": { "name": "Laptop Dell XPS 15", ... },
    "stock": 40,
    "reserved": 5,
    "soldCount": 5
  }
}
```

---

### **Step 9: Remove Stock**

**Request:**
```
POST http://localhost:5000/api/inventories/remove-stock
Content-Type: application/json

{
  "product": "67a4c5e1b2c3d4e5f6g7h8i9",
  "quantity": 15
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Đã trừ 15 từ stock",
  "data": {
    "_id": "...",
    "product": { "name": "Laptop Dell XPS 15", ... },
    "stock": 25,
    "reserved": 5,
    "soldCount": 5
  }
}
```

---

### **Step 10: Kiểm Tra Lỗi - Remove Stock Vượt Quá**

**Request:**
```
POST http://localhost:5000/api/inventories/remove-stock
Content-Type: application/json

{
  "product": "67a4c5e1b2c3d4e5f6g7h8i9",
  "quantity": 100
}
```

**Expected Error Response:**
```json
{
  "success": false,
  "message": "Stock không đủ. Hiện tại có 25, yêu cầu 100"
}
```

---

### **Step 11: Kiểm Tra Lỗi - Reserve Vượt Quá**

**Request:**
```
POST http://localhost:5000/api/inventories/reserve
Content-Type: application/json

{
  "product": "67a4c5e1b2c3d4e5f6g7h8i9",
  "quantity": 100
}
```

**Expected Error Response:**
```json
{
  "success": false,
  "message": "Stock không đủ để reserve. Hiện tại có 25, yêu cầu 100"
}
```

---

### **Step 12: Kiểm Tra Lỗi - Sell Vượt Quá**

**Request:**
```
POST http://localhost:5000/api/inventories/sell
Content-Type: application/json

{
  "product": "67a4c5e1b2c3d4e5f6g7h8i9",
  "quantity": 100
}
```

**Expected Error Response:**
```json
{
  "success": false,
  "message": "Reserved không đủ. Hiện tại có 5, yêu cầu 100"
}
```

---

### **Step 13: Kiểm Tra Lỗi - Quantity âm**

**Request:**
```
POST http://localhost:5000/api/inventories/add-stock
Content-Type: application/json

{
  "product": "67a4c5e1b2c3d4e5f6g7h8i9",
  "quantity": -5
}
```

**Expected Error Response:**
```json
{
  "success": false,
  "message": "Quantity phải lớn hơn 0"
}
```

---

### **Step 14: Get Inventory By ID**

**Request:**
```
GET http://localhost:5000/api/inventories/67a4c5e1b2c3d4e5f6g7h8j0
```

**Expected Response:** Một inventory object với populate product

---

## PHẦN 4: Chuẩn Bị Báo Cáo Word

### Cấu Trúc Báo Cáo Đề Xuất:

```
1. Tiêu Đề: Hệ Thống Quản Lý Kho Hàng (Inventory Management)

2. I. Mô Tả Hệ Thống
   - Database Models (Product, Inventory)
   - Logic các operation

3. II. Yêu Cầu Đã Thực Hiện
   - Auto tạo Inventory khi tạo Product
   - 6 API endpoints
   - Validation logic

4. III. Hướng Dẫn Chạy
   - Cài dependencies
   - MongoDB setup
   - Khởi động server

5. IV. Test Results (Này là phần quan trọng - chụp ảnh Postman)
   - Ảnh Step 1: Create Product
   - Ảnh Step 5: Add Stock
   - Ảnh Step 7: Reserve
   - Ảnh Step 8: Sell
   - Ảnh Step 10: Error case

6. V. Source Code (Copy đoạn code chính)
   - Models
   - Controller logic
   - Routes

7. Kết Luận
```

### Cách Chụp Ảnh Postman:

1. **Chụp Request Screen:**
   - Ở Postman, thực hiện request
   - Alt + Print Screen hoặc dùng Snipping Tool
   - Cắt phần Request + Response

2. **Chụp Response:**
   - Cuộn xuống phần "Body"
   - Chụp cả JSON response

3. **Chụp Error Case:**
   - Thực hiện request lỗi (Step 10-13)
   - Chụp error message

### Cách Tạo File Word:

1. Mở Microsoft Word
2. Chèn ảnh: Insert → Pictures
3. Chỉnh kích thước ảnh hợp lý
4. Thêm text giải thích mỗi ảnh

---

## PHẦN 5: Final QA Checklist

- [ ] MongoDB đang chạy?
- [ ] npm install xong?
- [ ] Server chạy không lỗi?
- [ ] Tất cả 14 steps test thành công?
- [ ] Error cases hoạt động đúng?
- [ ] Git commit done?
- [ ] Postman Collection import được?
- [ ] Word report ready?

---

## Hướng Dẫn Chụp Ảnh Chi Tiết (Đơn Giản)

### Windows 10/11:

**Cách 1: Snipping Tool**
- Nhấn `Win + Shift + S`
- Kéo chọn vùng cần chụp
- Ảnh sẽ lưu vào clipboard
- Paste vào Word (Ctrl + V)

**Cách 2: Print Screen**
- Nhấn `Print Screen` (full screen)
- Hoặc `Alt + Print Screen` (chỉ window hiện tại)
- Paste vào Word

**Cách 3: Postman Built-in Export**
- Right-click response → Copy
- Paste vào Word dưới dạng text

---

## Notes

- Mỗi API test nên lưu ảnh
- Mỗi error case cũng nên có ảnh chứng minh
- Word report nên có 5-8 ảnh Postman
- Có thể lưu database state screenshots (MongoDB Compass)

---

## Done Checklist

- ✅ Code Backend đã xong (Node.js + Express + MongoDB)
- ✅ Postman Collection đã xong
- ✅ Git commit done
- ⏳ Word Report (cần bạn chụp ảnh + tạo)
- ✅ README reference

---

**Liên Hệ: Nếu có vấn đề khi chạy, check:**
1. MongoDB chạy chưa?
2. Dependencies cài đầy đủ chưa?
3. Port 5000 bị chiếm chưa?
4. .env file config đúng chưa?
