# Johan's Hub E-Commerce

A full-stack MERN (MongoDB, Express, React, Node.js) e-commerce platform built for selling T-shirts. This project features a complete user-facing storefront, a dynamic cart, and a full-featured admin panel for managing products and orders.

---

## 🚀 Features

### User Features
* **Browse Products:** Clean collection page with all products.
* **Dynamic Filtering:** Filter products by Category (`Over Sized`, `Slim Fit`), Color, and Price Range.
* **Pagination:** Products are split into pages (20 items per page).
* **Product Details:** View individual product details with size and color selection.
* **Shopping Cart:** Fully functional cart with options to increase/decrease quantity and delete items.
* **Order Now:** A "Order Now" button to add to cart and go directly to checkout.
* **Flexible Payments:** Choose between "Cash on Delivery" or "Manual Payment" (Bkash/Nagad) by providing a Transaction ID.
* **User Auth:** Secure user Registration and Login using JWT.
* **Profile Page:** Registered users can view their order history.

### Admin Features
* **Secure Admin Routes:** Admin panel is protected and only accessible to users with `isAdmin: true`.
* **Product Management (CRUD):**
    * **Create:** Add new products with details, stock, and images.
    * **Read:** View a list of all products in the database.
    * **Update:** Edit existing product information.
    * **Delete:** Remove products from the database.
* **Image Upload:** Seamless image upload to **Cloudinary** when adding or editing products.
* **Order Management (CRUD):**
    * View a list of all user orders.
    * See order details (customer info, products ordered, total price).
    * **Verify Manual Payments:** Check the provided Transaction ID (TrxID) from the order details page.
    * Mark orders as "Delivered" (which also marks them as "Paid").
    * Delete orders.

---

## 🛠 Tech Stack

* **Frontend:** React (with Vite), TypeScript, Tailwind CSS, React Router
* **Backend:** Node.js, Express, MongoDB (with Mongoose)
* **Authentication:** JWT (JSON Web Tokens), bcryptjs
* **Image Storage:** Cloudinary, Multer

---

## ⚙️ Installation & Setup

Follow these steps to set up the project locally.

### Prerequisites
* [Node.js](https://nodejs.org/) (Version 18+)
* MongoDB Account (A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster is recommended)
* Cloudinary Account (for image uploads)

### 1. Backend Setup

1.  Navigate to the `backend` folder:
    ```bash
    cd backend
    ```
2.  Install the necessary npm packages:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` folder. Copy the contents of `.env.example` and fill in your credentials.

    **backend/.env.example**
    ```env
    # --- MongoDB Configuration ---
    MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority

    # --- JSON Web Token (JWT) Configuration ---
    JWT_SECRET=your_super_secret_key_123

    # --- Cloudinary Configuration (For Image Uploads) ---
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    ```

4.  Run the database seeder to import products and the admin user:
    ```bash
    npm run data:import
    ```


### 2. Frontend Setup

1.  From the root directory, navigate to the `frontend` folder:
    ```bash
    cd ../frontend
    ```
    *(If you are already in the `backend` folder, just use `cd ../frontend`)*

2.  Install the necessary npm packages. Use `--legacy-peer-deps` if you encounter peer dependency errors:
    ```bash
    npm install --legacy-peer-deps
    ```

### 3. Running the Project

You must run both the backend and frontend servers simultaneously in **two separate terminals**.

* **Terminal 1 (Backend):**
    ```bash
    cd backend
    npm run dev
    ```
    *(Server will run on http://localhost:5000)*

* **Terminal 2 (Frontend):**
    ```bash
    cd frontend
    npm run dev
    ```
    *(Server will run on http://localhost:3000)*

Open **`http://localhost:3000`** in your browser to see the website.

---

## 👨‍💻 Author

* **Md. Jubayer Hasan**
* East West University

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2025 Md. Jubayer Hasan