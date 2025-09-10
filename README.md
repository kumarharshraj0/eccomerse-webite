# MERN E-Commerce Website

A full-stack **MERN (MongoDB, Express, React, Node.js)** e-commerce web application with **Razorpay payment integration** and a fully functional **Admin Panel**. This project is ideal for online shopping platforms and demonstrates modern web development practices.

---

## Features

### User Side
- Browse products by category (Mobiles, Laptops, Cameras, Headphones, etc.)
- Product search and filtering
- Add products to cart and checkout
- Secure payment using **Razorpay**
- User authentication and registration
- View order history and status

### Admin Panel
- Add, edit, and delete products
- Manage categories and stock
- View user orders and payment status
- Dashboard with product, order, and user statistics
- Secure login for admin only

### General Features
- Responsive design for mobile and desktop
- MongoDB for data storage
- JWT-based authentication
- Environment variable management using `.env`
- Error handling and form validation

---

## Tech Stack

- **Frontend:** React, context (optional), CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Payment Gateway:** Razorpay  
- **Authentication:** JWT  
- **Other Tools:** Axios, dotenv, bcrypt

---

## Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/mern-ecommerce.git
cd mern-ecommerce
Install dependencies for backend

cd server
npm install


Install dependencies for frontend

cd ../client
npm install


Create .env files

Server .env

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret


Client .env

REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id

Running the App

Start Backend

cd server
npm run dev


Start Frontend

cd client
npm start


The application should now be running at http://localhost:3000.

Folder Structure
mern-ecommerce/
│
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── App.js
│
├── server/                 # Node/Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── .gitignore
└── README.md

Payment Integration

Razorpay is integrated for secure online payments.

Users can pay for products directly from the checkout page.

Payment status is tracked in the database and visible in the admin panel.

Admin Panel

Accessible via /admin route.

Requires admin credentials for login.

Admin can manage products, view orders, and monitor statistics.

License

This project is open-source and available under the MIT License.

Author

 Name:kumarharshraj0
Email:kumar_2312res349@iitp.ac.in

