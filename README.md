# Foodio 🍔

Foodio is a modern, full-stack food ordering platform built for seamless user experience and robust performance. It features a stunning Next.js frontend and a powerful NestJS backend.

## 🚀 Tech Stack

### Frontend
- **Framework:** [Next.js 16 (React 19)](https://nextjs.org/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Icons:** [Lucide React](https://lucide.dev/) (Inferred/Commonly used)

### Backend
- **Framework:** [NestJS](https://nestjs.com/)
- **ORM:** [TypeORM](https://typeorm.io/)
- **Database:** PostgreSQL (with SQLite support for development)
- **Authentication:** Passport.js + JWT
- **Validation:** Class-validator & Class-transformer
- **Language:** TypeScript

---

## 🏗️ Project Structure

```text
foodio/
├── foodio-frontend/    # Next.js Application
└── foodie-backend/     # NestJS API Server
```

---

## 🛠️ Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/) (Make sure it's running)

### 1. Clone the Repository
```bash
git clone https://github.com/rahulxiao/foodio.git
cd foodio
```

### 2. Backend Setup
Go to the backend directory and install dependencies:
```bash
cd foodie-backend
npm install
```

Create a `.env` file in the `foodie-backend` directory:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=foodio
JWT_SECRET=your_super_secret_key
```

### 3. Frontend Setup
Go to the frontend directory and install dependencies:
```bash
cd ../foodio-frontend
npm install
```

---

## 🚦 How to Run

### Run Backend
In the `foodie-backend` directory:
```bash
# Development mode with hot-reload
npm run start:dev

# Production mode
npm run build
npm run start:prod
```
The API will be available at `http://localhost:3000` (default NestJS port).

### Run Frontend
In the `foodio-frontend` directory:
```bash
# Development mode
npm run dev

# Production mode
npm run build
npm run start
```
The application will be available at `http://localhost:2424` (or next available port).

---

## ✨ Features
- **User Authentication:** Secure Sign Up and Login using JWT.
- **Admin Dashboard:** Manage menu items, categories, and track orders.
- **Menu Management:** Admins can add, update, and manage food availability.
- **Order Tracking:** Users can view their order history and status.
- **Responsive Design:** Optimized for mobile, tablet, and desktop views.

---

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Developed with ❤️ by [Rahul](https://github.com/rahulxiao)
