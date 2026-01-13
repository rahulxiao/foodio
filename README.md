# 🍔 Foodio - Modern Food Ordering Platform

Foodio is a premium, full-stack food ordering application designed for seamless user experience. Built with modern technologies, it features a beautiful Next.js frontend and a robust NestJS backend with PostgreSQL database.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/typescript-%5E5.0.0-blue)

---

## 🎯 Features

### For Customers
- 🔐 **Secure Authentication** - JWT-based login and registration
- 🍽️ **Browse Menu** - View available dishes with images, descriptions, and prices
- 🛒 **Order Food** - Add items to cart and place orders with delivery address
- 📦 **Track Orders** - Real-time order status tracking (Pending → Preparing → Ready → Completed)
- 📱 **Responsive Design** - Optimized for mobile, tablet, and desktop
- 🔔 **Toast Notifications** - Real-time feedback for user actions

### For Administrators
- 📊 **Admin Dashboard** - Comprehensive order and menu management
- 🍲 **Menu Management** - Add, edit, delete menu items with image uploads
- 📂 **Category Management** - Organize items into categories
- 🎛️ **Availability Control** - Mark items as available or sold out
- 📋 **Order Management** - View all orders, update statuses, and view detailed order information
- 🔄 **Real-time Updates** - Live order polling for instant status changes

---

## 🚀 Tech Stack

### Frontend (`foodio-frontend`)
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 16.1.1 | React framework with server-side rendering |
| **React** | 19.2.3 | UI library |
| **TypeScript** | ^5 | Type safety |
| **Tailwind CSS** | ^4 | Utility-first styling |
| **React Hot Toast** | ^2.5.1 | Toast notifications |

### Backend (`foodie-backend`)
| Technology | Version | Purpose |
|-----------|---------|---------|
| **NestJS** | ^11.0.1 | Progressive Node.js framework |
| **TypeORM** | ^0.3.28 | Database ORM |
| **PostgreSQL** | ^8.16.3 | Production database |
| **Passport.js** | ^0.7.0 | Authentication middleware |
| **JWT** | ^11.0.2 | Secure token-based auth |
| **Bcrypt** | ^6.0.0 | Password hashing |
| **Class Validator** | ^0.14.3 | DTO validation |
| **Multer** | Built-in | File upload handling |

---

## 📁 Project Structure

```
Foodio/
├── foodio-frontend/          # Next.js Frontend Application
│   ├── app/                  # Next.js App Router
│   │   ├── admin/           # Admin dashboard page
│   │   ├── auth/            # Authentication page
│   │   ├── menu/            # Menu browsing page
│   │   ├── orders/          # User orders page
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page
│   │   └── globals.css      # Global styles
│   ├── components/          # Reusable components
│   │   ├── Navbar.tsx       # Navigation bar
│   │   ├── Footer.tsx       # Footer component
│   │   ├── FoodCard.tsx     # Menu item card
│   │   ├── Categories.tsx   # Category filter
│   │   ├── TopUI.tsx        # Hero section
│   │   ├── OrderModal.tsx   # Order placement modal
│   │   └── Confetti.tsx     # Success animation
│   ├── lib/                 # Utility libraries
│   │   ├── api.ts           # API endpoints configuration
│   │   └── notifications.tsx # Toast notification helpers
│   ├── public/              # Static assets
│   ├── package.json         # Dependencies
│   └── next.config.ts       # Next.js configuration
│
├── foodie-backend/          # NestJS Backend API
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   └── strategies/
│   │   │       └── jwt.strategy.ts
│   │   ├── users/          # Users module
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.module.ts
│   │   │   └── entities/
│   │   │       └── user.entity.ts
│   │   ├── menu/           # Menu items module
│   │   │   ├── menu.controller.ts
│   │   │   ├── menu.service.ts
│   │   │   ├── menu.module.ts
│   │   │   └── entities/
│   │   │       └── menu-item.entity.ts
│   │   ├── orders/         # Orders module
│   │   │   ├── orders.controller.ts
│   │   │   ├── orders.service.ts
│   │   │   ├── orders.module.ts
│   │   │   └── entities/
│   │   │       ├── order.entity.ts
│   │   │       └── order-item.entity.ts
│   │   ├── app.module.ts   # Root module
│   │   └── main.ts         # Application entry point
│   ├── uploads/            # Uploaded images storage
│   ├── .env                # Environment variables
│   ├── package.json        # Dependencies
│   └── tsconfig.json       # TypeScript configuration
│
├── README.md               # This file
└── LICENSE                 # MIT License
```

---

## ⚡ Quick Start

For experienced developers who want to get up and running immediately:

```bash
# Clone and navigate to project
git clone https://github.com/rahulxiao/foodio.git
cd Foodio

# Setup Backend
cd foodie-backend
npm ci                          # Clean install dependencies
# Create .env file with your database credentials (see below)
npm run start:dev              # Start backend on http://localhost:2424

# Setup Frontend (in a new terminal)
cd foodio-frontend
npm ci                          # Clean install dependencies
npm run dev                    # Start frontend on http://localhost:3000
```

> **📌 Don't forget**: Create `.env` file in `foodie-backend/` with PostgreSQL credentials and create the `foodio` database!

---

## 🛠️ Installation & Setup

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)

### Step 1: Clone the Repository

```bash
git clone https://github.com/rahulxiao/foodio.git
cd Foodio
```

### Step 2: Backend Setup

#### 2.1 Install Dependencies

Navigate to the backend directory:

```bash
cd foodie-backend
```

**Option 1: Standard Installation** (Recommended for development)
```bash
npm install
```

**Option 2: Clean Installation** (Recommended for production/CI/CD)
```bash
npm ci
```

**Option 3: Force Clean Installation** (If you encounter issues)
```bash
# Remove existing dependencies and lock file
rm -rf node_modules package-lock.json

# Reinstall everything from scratch
npm install
```

> **💡 Tip:** 
> - `npm install` installs dependencies and may update `package-lock.json`
> - `npm ci` provides faster, reliable, and reproducible builds (uses exact versions from `package-lock.json`)
> - Use `npm ci` in production environments and CI/CD pipelines

#### 2.2 Configure Environment Variables

Create a `.env` file in the `foodie-backend` directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password_here
DB_NAME=foodio

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production

# Application Port
PORT=2424
```

#### 2.3 Setup PostgreSQL Database

1. Open PostgreSQL command line or pgAdmin
2. Create the database:

```sql
CREATE DATABASE foodio;
```

3. The tables will be created automatically by TypeORM when you first run the application (with `synchronize: true`)

### Step 3: Frontend Setup

#### 3.1 Install Dependencies

Navigate to the frontend directory:

```bash
cd ../foodio-frontend
```

**Option 1: Standard Installation** (Recommended for development)
```bash
npm install
```

**Option 2: Clean Installation** (Recommended for production/CI/CD)
```bash
npm ci
```

**Option 3: Force Clean Installation** (If you encounter issues)
```bash
# Remove existing dependencies and lock files
rm -rf node_modules package-lock.json pnpm-lock.yaml

# Reinstall using npm
npm install
```

> **⚠️ Note:** This project uses **npm** as the package manager. If you see `pnpm-lock.yaml`, remove it and use `npm install`.

#### 3.2 Configure API Endpoint (Optional)

If your backend runs on a different port, update `lib/api.ts`:

```typescript
const BASE_URL = 'http://localhost:2424'; // Change if needed
```

---

## 🚦 Running the Application

### Development Mode

You need to run both frontend and backend servers simultaneously.

#### Terminal 1 - Start Backend Server

```bash
cd foodie-backend
npm run start:dev
```

The API will be available at **http://localhost:2424**

#### Terminal 2 - Start Frontend Server

```bash
cd foodio-frontend
npm run dev
```

The application will be available at **http://localhost:3000**

### Production Mode

#### Build Backend

```bash
cd foodie-backend
npm run build
npm run start:prod
```

#### Build Frontend

```bash
cd foodio-frontend
npm run build
npm run start
```

---

## 👥 Default Users

After first run, you can create accounts via the registration page. To create an admin account:

1. Register a normal user account
2. Manually update the user's role in the database:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

---

## 📡 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login

### Menu Items
- `GET /menu` - Get all menu items
- `POST /menu` - Create menu item (Admin only)
- `PUT /menu/:id` - Update menu item (Admin only)
- `DELETE /menu/:id` - Delete menu item (Admin only)

### Orders
- `GET /orders` - Get all orders (Admin) or user's orders (User)
- `GET /orders/:id` - Get specific order
- `POST /orders` - Create new order
- `PUT /orders/:id/status` - Update order status (Admin only)

### Users
- `GET /users/profile` - Get current user profile
- `PUT /users/profile` - Update user profile

---

## 🎨 Key Features Implementation

### UUID Order IDs
Orders use UUID v4 for enhanced security and scalability instead of incremental integers.

### Image Upload
Menu item images are stored in the `uploads/` directory and served statically.

### JWT Authentication
Secure token-based authentication with Passport.js strategy.

### Real-time Order Tracking
Order status updates are polled every 10 seconds on the user orders page.

### Role-based Access Control
Admin users have access to the dashboard at `/admin`, regular users see their orders at `/orders`.

---

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token-based authentication
- ✅ Input validation with class-validator
- ✅ CORS configuration
- ✅ Role-based route protection
- ✅ SQL injection prevention (TypeORM)

---

## 🧪 Testing

### Backend Tests

```bash
cd foodie-backend

# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

---

## � Troubleshooting

### Common Installation Issues

#### Problem: `npm install` fails with permission errors
**Solution (Windows):**
```powershell
# Run PowerShell as Administrator and execute:
npm install --global --production windows-build-tools
```

**Solution (Linux/Mac):**
```bash
# Don't use sudo, fix npm permissions instead:
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

#### Problem: `ENOENT: no such file or directory` error
**Solution:**
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### Problem: Port already in use (Backend: 2424 or Frontend: 3000)
**Solution (Windows):**
```powershell
# Find and kill the process
netstat -ano | findstr :2424
taskkill /PID <PID_NUMBER> /F
```

**Solution (Linux/Mac):**
```bash
# Kill process on port 2424
lsof -ti:2424 | xargs kill -9

# Or change the port in .env (Backend) or package.json (Frontend)
```

#### Problem: PostgreSQL connection refused
**Solution:**
1. Ensure PostgreSQL is running:
   ```bash
   # Windows: Check Services app
   # Linux: sudo systemctl status postgresql
   # Mac: brew services list
   ```
2. Verify your `.env` credentials match your PostgreSQL setup
3. Check if database 'foodio' exists: `psql -U postgres -l`

#### Problem: Module not found errors after `git pull`
**Solution:**
```bash
# Recommended: Use npm ci for clean installation
npm ci

# Or manually clean and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Problem: `bcrypt` installation fails
**Solution (Windows):**
```powershell
# Install Visual Studio Build Tools
npm install --global windows-build-tools

# Then retry
npm install
```

**Solution (Linux/Mac):**
```bash
# Install build essentials
# Ubuntu/Debian: sudo apt-get install build-essential
# Mac: xcode-select --install

npm install
```

#### Problem: TypeORM sync issues or database schema errors
**Solution:**
```bash
# Drop and recreate the database
psql -U postgres
DROP DATABASE foodio;
CREATE DATABASE foodio;
\q

# Restart backend - TypeORM will recreate tables
npm run start:dev
```

### Frontend-Specific Issues

#### Problem: Next.js hydration errors
**Solution:**
```bash
# Clear .next cache
rm -rf .next
npm run dev
```

#### Problem: pnpm-lock.yaml conflicts
**Solution:**
```bash
# This project uses npm, not pnpm
rm pnpm-lock.yaml pnpm-workspace.yaml
npm install
```

### Still Having Issues?

1. **Check Node.js version**: `node --version` (should be v18+)
2. **Check npm version**: `npm --version` (should be v9+)
3. **Clear all caches**:
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```
4. **Create an issue**: [GitHub Issues](https://github.com/rahulxiao/foodio/issues)

---

## �📝 Environment Variables Reference

### Backend (.env)

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DB_HOST` | PostgreSQL host | localhost | Yes |
| `DB_PORT` | PostgreSQL port | 5432 | Yes |
| `DB_USERNAME` | Database username | postgres | Yes |
| `DB_PASSWORD` | Database password | - | Yes |
| `DB_NAME` | Database name | foodio | Yes |
| `JWT_SECRET` | Secret key for JWT | - | Yes |
| `PORT` | Application port | 2424 | No |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Developer

**Rahul Xiao**
- GitHub: [@rahulxiao](https://github.com/rahulxiao)

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- NestJS team for the robust backend framework
- All contributors who help improve this project

---

## 📞 Support

If you encounter any issues or have questions, please:
1. Check existing [Issues](https://github.com/rahulxiao/foodio/issues)
2. Create a new issue if yours isn't already listed
3. Provide as much detail as possible

---

Made with ❤️ by Rahul Xiao
