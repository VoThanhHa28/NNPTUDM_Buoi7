# Inventory Management System

Hệ thống quản lý kho hàng đơn giản với Node.js + Express + MongoDB + Mongoose

## Cài đặt

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Khởi động MongoDB

Chắc chắn MongoDB đang chạy trên `mongodb://localhost:27017`

Nếu sử dụng MongoDB Atlas, chỉnh sửa `.env`:
```
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/inventory_db
```

### 3. Khởi động server

```bash
npm start
```

Hoặc dùng nodemon để auto-reload:
```bash
npm run dev
```

Server sẽ chạy trên `http://localhost:5000`

---

## API Endpoints

### 1. **Products**

#### Create Product (Auto tạo Inventory)
```
POST /api/products
Content-Type: application/json

{
  "name": "Laptop Dell XPS 15"
}
```
Response:
```json
{
  "success": true,
  "message": "Sản phẩm được tạo thành công",
  "data": {
    "product": {
      "_id": "...",
      "name": "Laptop Dell XPS 15",
      "createdAt": "...",
      "updatedAt": "..."
    },
    "inventory": {
      "_id": "...",
      "product": "...",
      "stock": 0,
      "reserved": 0,
      "soldCount": 0
    }
  }
}
```

#### Get All Products
```
GET /api/products
```

---

### 2. **Inventories**

#### Get All Inventories (với populate product)
```
GET /api/inventories
```
Response:
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "...",
      "product": {
        "_id": "...",
        "name": "Laptop Dell XPS 15"
      },
      "stock": 50,
      "reserved": 5,
      "soldCount": 3
    }
  ]
}
```

#### Get Inventory By ID (với populate product)
```
GET /api/inventories/:id
```

#### Add Stock
```
POST /api/inventories/add-stock
Content-Type: application/json

{
  "product": "<product_id>",
  "quantity": 50
}
```
Logic: `stock += quantity`

#### Remove Stock
```
POST /api/inventories/remove-stock
Content-Type: application/json

{
  "product": "<product_id>",
  "quantity": 10
}
```
Logic: 
- Kiểm tra: `stock >= quantity`
- Thực hiện: `stock -= quantity`

#### Reserve (Đặt hàng)
```
POST /api/inventories/reserve
Content-Type: application/json

{
  "product": "<product_id>",
  "quantity": 5
}
```
Logic:
- Kiểm tra: `stock >= quantity`
- Thực hiện: `stock -= quantity`, `reserved += quantity`

#### Sell (Bán hàng)
```
POST /api/inventories/sell
Content-Type: application/json

{
  "product": "<product_id>",
  "quantity": 3
}
```
Logic:
- Kiểm tra: `reserved >= quantity`
- Thực hiện: `reserved -= quantity`, `soldCount += quantity`

---

## Quy tắc Validation

1. **Quantity validation:**
   - Quantity phải > 0
   - Không được phép quantity âm hoặc = 0

2. **Stock/Reserved validation:**
   - stock >= 0 (MongoDB schema validate)
   - reserved >= 0 (MongoDB schema validate)
   - soldCount >= 0 (MongoDB schema validate)

3. **Operation validation:**
   - `remove-stock`: Kiểm tra `stock >= quantity`
   - `reserve`: Kiểm tra `stock >= quantity`
   - `sell`: Kiểm tra `reserved >= quantity`

---

## Flow Dữ Liệu Ví Dụ

```
1. Create Product "Laptop"
   → Auto tạo Inventory {stock: 0, reserved: 0, soldCount: 0}

2. Add Stock 50
   → Inventory {stock: 50, reserved: 0, soldCount: 0}

3. Reserve 5
   → Kiểm tra: stock (50) >= quantity (5) ✓
   → Inventory {stock: 45, reserved: 5, soldCount: 0}

4. Sell 3
   → Kiểm tra: reserved (5) >= quantity (3) ✓
   → Inventory {stock: 45, reserved: 2, soldCount: 3}

5. Remove Stock 20
   → Kiểm tra: stock (45) >= quantity (20) ✓
   → Inventory {stock: 25, reserved: 2, soldCount: 3}
```

---

## Postman Testing

1. Import file `Postman_Collection.json` vào Postman
2. Thay `<product_id>` bằng ID thực tế từ kết quả create product
3. Test các endpoint theo thứ tự

---

## Cấu trúc Project

```
NNPTUDM_Buoi7/
├── models/
│   ├── Product.js
│   └── Inventory.js
├── controllers/
│   └── inventoryController.js
├── routes/
│   ├── productRoutes.js
│   └── inventoryRoutes.js
├── server.js
├── package.json
├── .env
├── Postman_Collection.json
└── README.md
```

---

## Error Handling

API sẽ trả về response:
```json
{
  "success": false,
  "message": "Chi tiết lỗi"
}
```

Nếu có lỗi validation hoặc logic không hợp lệ.

---

## Lưu ý

- Code này là **simple version**, không production-ready
- Không có authentication/authorization
- Không có transaction (nên xem xét khi deploy production)
- MongoDB phải chạy cục bộ hoặc cấu hình Atlas trong `.env`
