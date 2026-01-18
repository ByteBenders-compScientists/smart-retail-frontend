# drinx retailers - Distributed Supermarket Management System

A modern, distributed web application for managing a supermarket chain with headquarters in Nairobi and branches in Kisumu, Mombasa, Nakuru, and Eldoret.

## Project Overview

drinx retailers is a Next.js-based frontend application that enables customers to purchase soft drinks (Coke, Fanta, Sprite) from any branch and allows admins to manage inventory and view comprehensive sales reports across all locations.

## Tech Stack

- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript (TSX)
- **Styling:** Tailwind CSS + SASS
- **Icons:** Lucide React
- **State Management:** React Hooks
- **Payment Integration:** M-Pesa Sandbox API (Backend handles this)

## What the Web App Does

### The Problem We're Solving
A businessman owns a supermarket chain with **1 headquarters (Nairobi)** and **4 branches (Kisumu, Mombasa, Nakuru, Eldoret)**. The chain sells soft drinks at the **same price across all locations**. Currently, there's no efficient way to:
- Let customers buy from any branch
- Track sales across all locations
- Manage inventory restocking from headquarters
- View consolidated sales reports

### The Solution: drinx retailers Distributed Web Application
A web-based system that connects all 5 locations, allowing real-time purchasing and centralized management.

---

## Application Flow

### 1️⃣ CUSTOMER FLOW (Normal User)

```
START
  ↓
[Landing Page]
  ↓
Choose: Login or Register?
  ↓
┌─────────────────┐
│   REGISTER      │ → Enter: Name, Email, Phone, Password
│   (New User)    │ → Click "Register"
└─────────────────┘ → Account Created ✓
  ↓
┌─────────────────┐
│     LOGIN       │ → Enter: Email/Phone, Password
│  (Existing User)│ → Click "Login"
└─────────────────┘ → Authenticated ✓
  ↓
[Customer Dashboard]
  ↓
┌──────────────────────────────────────┐
│ SELECT BRANCH                        │
│ • Nairobi HQ                         │
│ • Kisumu Branch                      │
│ • Mombasa Branch                     │
│ • Nakuru Branch                      │
│ • Eldoret Branch                     │
└──────────────────────────────────────┘
  ↓
[Shop/Browse Products]
  ↓
┌──────────────────────────────────────┐
│ Available Drinks (Same Price All):  │
│                                      │
│ 🥤 Coke    - KSh 60  [Add to Cart]  │
│ 🥤 Fanta   - KSh 60  [Add to Cart]  │
│ 🥤 Sprite  - KSh 60  [Add to Cart]  │
│                                      │
│ (Quantity selector available)        │
└──────────────────────────────────────┘
  ↓
[Shopping Cart]
  ↓
Review Items:
  • Coke x 3 = KSh 180
  • Fanta x 1 = KSh 60
  • Total = KSh 240
  ↓
[Proceed to Checkout]
  ↓
┌──────────────────────────────────────┐
│    M-PESA PAYMENT (SANDBOX)          │
│                                      │
│ 1. Enter M-Pesa Phone Number        │
│ 2. Click "Pay Now"                  │
│ 3. System sends STK Push             │
│ 4. Enter M-Pesa PIN on phone        │
│ 5. Payment Confirmed ✓               │
└──────────────────────────────────────┘
  ↓
[Order Confirmation]
  • Order ID generated
  • Receipt displayed
  • Can view in "My Orders"
  ↓
[View Order History]
  • List of all past orders
  • Order details
  • Payment status
  ↓
END (Can continue shopping or logout)
```

---

### 2️⃣ ADMIN FLOW (Administrator)

```
START
  ↓
[Admin Login Page]
  ↓
Enter Admin Credentials:
  • Admin Email
  • Admin Password
  ↓
[Admin Dashboard]
  ↓
┌────────────────────────────────────────────┐
│ ADMIN MAIN OPTIONS:                        │
│                                            │
│ 1. 📊 VIEW SALES REPORTS                   │
│ 2. 📦 RESTOCK BRANCHES                     │
│ 3. 🏪 MANAGE INVENTORY                     │
└────────────────────────────────────────────┘
  ↓
Option 1: [VIEW SALES REPORTS]
  ↓
┌─────────────────────────────────────────────────┐
│ COMPREHENSIVE SALES REPORT                      │
│                                                 │
│ 📈 Sales by Drink Brand:                        │
│ ├─ Coke:   450 units sold → KSh 27,000         │
│ ├─ Fanta:  320 units sold → KSh 19,200         │
│ └─ Sprite: 280 units sold → KSh 16,800         │
│                                                 │
│ 🏪 Sales by Branch:                             │
│ ├─ Nairobi HQ:  KSh 15,000                     │
│ ├─ Kisumu:      KSh 12,000                     │
│ ├─ Mombasa:     KSh 14,000                     │
│ ├─ Nakuru:      KSh 11,500                     │
│ └─ Eldoret:     KSh 10,500                     │
│                                                 │
│ 💰 GRAND TOTAL: KSh 63,000                      │
│                                                 │
│ Filters:                                        │
│ • By Date Range                                 │
│ • By Branch                                     │
│ • By Product                                    │
└─────────────────────────────────────────────────┘
  ↓
Option 2: [RESTOCK BRANCHES]
  ↓
┌─────────────────────────────────────────────────┐
│ RESTOCK INVENTORY                               │
│ (All restocking done from Nairobi HQ)           │
│                                                 │
│ Select Branch: [Kisumu ▼]                       │
│                                                 │
│ Current Stock Levels:                           │
│ • Coke:   45 units                              │
│ • Fanta:  23 units (Low Stock! ⚠️)              │
│ • Sprite: 67 units                              │
│                                                 │
│ Restock Quantities:                             │
│ • Coke:   [50] units                            │
│ • Fanta:  [100] units                           │
│ • Sprite: [50] units                            │
│                                                 │
│ [Confirm Restock] button                        │
└─────────────────────────────────────────────────┘
  ↓
Restock Confirmation:
  • Stock updated at selected branch
  • HQ inventory reduced accordingly
  • Activity logged
  ↓
END (Return to dashboard or continue managing)
```

---

## Complete System Flow (All Users)

### Real-Time Multi-Device Demo Flow

**Device 1 - ADMIN (Nairobi HQ)**
```
Admin logs in → Views empty/initial reports → Monitors dashboard
↓ (Waits for customer activity)
Sales start appearing in real-time
↓
Views updated reports showing:
  • Which branch made sale
  • Which drink was purchased
  • Revenue generated
  • Running totals
```

**Device 2 - CUSTOMER A (Shops at Kisumu)**
```
Customer A registers/logs in
↓
Selects: Kisumu Branch
↓
Adds to cart: 2 Coke, 1 Sprite
↓
Proceeds to checkout (Total: KSh 180)
↓
Pays via M-Pesa Sandbox (enters phone, PIN)
↓
Payment confirmed → Order created
↓
SALE RECORDED: Kisumu Branch
  • 2 Coke sold
  • 1 Sprite sold
  • Revenue: KSh 180
```

**Device 3 - CUSTOMER B (Shops at Mombasa)**
```
Customer B logs in
↓
Selects: Mombasa Branch
↓
Adds to cart: 3 Fanta
↓
Checkout (Total: KSh 180)
↓
M-Pesa payment → Confirmed
↓
SALE RECORDED: Mombasa Branch
  • 3 Fanta sold
  • Revenue: KSh 180
```

**Device 4 - CUSTOMER C (Shops at Nairobi HQ)**
```
Customer C logs in
↓
Selects: Nairobi HQ
↓
Adds to cart: 1 Coke, 1 Fanta, 1 Sprite
↓
Checkout (Total: KSh 180)
↓
M-Pesa payment → Confirmed
↓
SALE RECORDED: Nairobi HQ
  • 1 each of all drinks
  • Revenue: KSh 180
```

**Back to Device 1 - ADMIN Views Updated Report**
```
┌─────────────────────────────────────────┐
│ LIVE SALES REPORT                       │
│                                         │
│ By Brand:                               │
│ • Coke:   3 units → KSh 180            │
│ • Fanta:  4 units → KSh 240            │
│ • Sprite: 2 units → KSh 120            │
│                                         │
│ By Branch:                              │
│ • Nairobi:  KSh 180                    │
│ • Kisumu:   KSh 180                    │
│ • Mombasa:  KSh 180                    │
│                                         │
│ 💰 GRAND TOTAL: KSh 540                 │
└─────────────────────────────────────────┘
```

---

## Key System Features

### Customer Features
- ✅ User registration and authentication
- ✅ Browse available drinks across all branches
- ✅ Select branch location (any of the 5 locations)
- ✅ Add items to cart with quantity selection
- ✅ Real M-Pesa payment integration (Sandbox API)
- ✅ View order history and receipts
- ✅ Same prices across all branches

### Admin Features
- ✅ Secure admin authentication
- ✅ Real-time sales monitoring dashboard
- ✅ Restock management for all branches from HQ
- ✅ Comprehensive sales reports showing:
  - Sales by drink brand (Coke, Fanta, Sprite)
  - Revenue per drink brand
  - Sales by branch location
  - Grand total revenue across all branches
- ✅ Inventory tracking per branch
- ✅ Low stock alerts

### Technical Features
- ✅ Distributed architecture (5 locations, 1 system)
- ✅ Real-time data synchronization
- ✅ Concurrent multi-user support
- ✅ Secure payment processing
- ✅ Role-based access control (Customer vs Admin)

## Project Structure

```
drinx retailers/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Landing/Home page
│   │   ├── auth/                     # Authentication pages
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   ├── customer/                 # Customer-facing pages
│   │   │   ├── layout.tsx            # Customer layout wrapper
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── shop/
│   │   │   │   └── page.tsx
│   │   │   ├── cart/
│   │   │   │   └── page.tsx
│   │   │   └── orders/
│   │   │       └── page.tsx
│   │   └── admin/                    # Admin-facing pages
│   │       ├── layout.tsx            # Admin layout wrapper
│   │       ├── dashboard/
│   │       │   └── page.tsx
│   │       ├── restock/
│   │       │   └── page.tsx
│   │       └── reports/
│   │           └── page.tsx
│   │
│   ├── components/                   # Reusable UI components
│   │   ├── common/                   # Shared components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Modal.tsx
│   │   ├── customer/                 # Customer-specific components
│   │   │   ├── ProductCard.tsx
│   │   │   ├── BranchSelector.tsx
│   │   │   ├── CartItem.tsx
│   │   │   └── OrderCard.tsx
│   │   └── admin/                    # Admin-specific components
│   │       ├── SalesChart.tsx
│   │       ├── RestockForm.tsx
│   │       ├── ReportTable.tsx
│   │       └── BranchStats.tsx
│   │
│   ├── services/                     # API service layer
│   │   ├── api.ts                    # Base API configuration
│   │   ├── authService.ts            # Authentication APIs
│   │   ├── productService.ts         # Product-related APIs
│   │   ├── orderService.ts           # Order management APIs
│   │   ├── paymentService.ts         # M-Pesa payment APIs
│   │   └── adminService.ts           # Admin operations APIs
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── useAuth.ts                # Authentication state
│   │   ├── useCart.ts                # Shopping cart state
│   │   ├── useProducts.ts            # Product data fetching
│   │   ├── useOrders.ts              # Order management
│   │   └── useLocalStorage.ts        # Local storage helper
│   │
│   ├── types/                        # TypeScript type definitions
│   │   ├── user.ts                   # User-related types
│   │   ├── product.ts                # Product types
│   │   ├── order.ts                  # Order types
│   │   ├── branch.ts                 # Branch types
│   │   └── api.ts                    # API response types
│   │
│   ├── lib/                          # Utility functions and helpers
│   │   ├── utils.ts                  # General utilities
│   │   ├── constants.ts              # App constants
│   │   └── validators.ts             # Form validation helpers
│   │
│   └── styles/                       # Global styles and SASS modules
│       ├── globals.scss              # Global styles
│       └── variables.scss            # SASS variables
│
├── public/                           # Static assets
│   ├── images/
│   │   ├── drinks/
│   │   │   ├── coke.png
│   │   │   ├── fanta.png
│   │   │   └── sprite.png
│   │   └── logo.png
│   └── favicon.ico
│
├── .env.local                        # Environment variables
├── .gitignore
├── next.config.js                    # Next.js configuration
├── package.json
├── tsconfig.json                     # TypeScript configuration
├── tailwind.config.js                # Tailwind CSS configuration
└── README.md
```

## Key Design Decisions

### Routing Strategy
- **App Router**: Using Next.js 15+ app directory for modern routing
- **Role-based layouts**: Separate layouts for customer and admin interfaces
- **Protected routes**: Authentication guards implemented via middleware

### Component Organization
- **Common components**: Shared across both customer and admin interfaces
- **Role-specific components**: Separated to maintain clear boundaries
- **Presentational vs Container**: Components focus on UI, hooks handle logic

### State Management
- **Local state**: React useState for component-level state
- **Custom hooks**: Centralized business logic and data fetching
- **No external state library**: Keeping it simple with React's built-in features

### Styling Approach
- **Tailwind CSS**: Utility-first for rapid development
- **SASS modules**: For complex, component-specific styles
- **No gradients**: Clean, professional design without "vibe-coded" aesthetics
- **Consistent color palette**: Professional blues, grays, and accent colors

## Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_MPESA_CONSUMER_KEY=your_consumer_key
NEXT_PUBLIC_MPESA_CONSUMER_SECRET=your_consumer_secret
```

## Installation & Setup

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd drinx retailers
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   Navigate to `http://localhost:3000`

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

## User Roles

### Customer
- **Access**: Register → Login → Shop
- **Capabilities**: Browse products, add to cart, checkout, view orders
- **Branch selection**: Can shop from any of the 5 locations

### Admin
- **Access**: Secure admin login
- **Capabilities**: Restock inventory, view reports, manage all branches
- **Dashboard**: Comprehensive analytics and sales data

## Product Catalog

The system manages three drink brands:
1. **Coke** - Fixed retail price across all branches
2. **Fanta** - Fixed retail price across all branches
3. **Sprite** - Fixed retail price across all branches

## Branches

1. **Nairobi** - Headquarters (restocking center)
2. **Kisumu** - Branch
3. **Mombasa** - Branch
4. **Nakuru** - Branch
5. **Eldoret** - Branch

## Demo/Presentation Setup

For CAT 1 demonstration, prepare 4 devices:

### Device 1: Admin
- Login as admin
- Monitor dashboard
- View real-time sales reports
- Demonstrate restocking functionality

### Devices 2-4: Customers
- Each device logged in as different customer
- Shopping from different branches
- Simultaneous purchases
- Real M-Pesa payments via sandbox API

## API Integration Points

The frontend communicates with the backend via these endpoints:

### Authentication
- `POST /api/auth/register` - Customer registration
- `POST /api/auth/login` - User/Admin login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `GET /api/products/branch/:branchId` - Get branch inventory

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details

### Payments
- `POST /api/payments/mpesa/initiate` - Start M-Pesa payment
- `POST /api/payments/mpesa/callback` - M-Pesa callback handler
- `GET /api/payments/:orderId/status` - Check payment status

### Admin
- `POST /api/admin/restock` - Restock branch inventory
- `GET /api/admin/reports/sales` - Get sales reports
- `GET /api/admin/reports/branch/:branchId` - Branch-specific report
- `GET /api/admin/reports/product/:productId` - Product sales report

## Code Standards

### TypeScript
- Strict mode enabled
- Explicit type definitions for props and state
- No `any` types (use `unknown` or proper typing)

### Component Structure
```tsx
// Functional components with TypeScript
interface ComponentProps {
  // Props definition
}

export default function Component({ prop }: ComponentProps) {
  // Component logic
  return (
    // JSX
  );
}
```

### Naming Conventions
- **Components**: PascalCase (e.g., `ProductCard.tsx`)
- **Hooks**: camelCase with 'use' prefix (e.g., `useAuth.ts`)
- **Services**: camelCase with 'Service' suffix (e.g., `authService.ts`)
- **Types**: PascalCase (e.g., `User`, `Product`)

## Testing Strategy

### Manual Testing Checklist

**Customer Flow:**
- [ ] User can register successfully
- [ ] User can login with valid credentials
- [ ] User can select a branch
- [ ] User can browse products
- [ ] User can add items to cart
- [ ] Cart updates correctly
- [ ] Checkout initiates M-Pesa payment
- [ ] Order appears in order history

**Admin Flow:**
- [ ] Admin can login securely
- [ ] Admin can view dashboard
- [ ] Admin can restock branches
- [ ] Admin can view sales reports
- [ ] Reports show correct data per brand
- [ ] Grand total calculates correctly
- [ ] Branch breakdown is accurate

## Troubleshooting

### Common Issues

**Issue**: Port 3000 already in use
```bash
# Solution: Use different port
npm run dev -- -p 3001
```

**Issue**: TypeScript errors
```bash
# Solution: Check types and run type-check
npm run type-check
```

**Issue**: API connection fails
```bash
# Solution: Verify .env.local has correct API URL
# Ensure backend server is running
```

## Performance Optimization

- **Code splitting**: Automatic with Next.js app router
- **Image optimization**: Using Next.js Image component
- **Lazy loading**: Components loaded on demand
- **API caching**: React Query or SWR (if implemented)

## Security Considerations

- **Authentication**: JWT tokens stored securely
- **Route protection**: Middleware guards sensitive routes
- **Input validation**: Client-side validation before API calls
- **HTTPS**: Required in production
- **Environment variables**: Never commit `.env.local`

## Deployment

### Production Build
```bash
npm run build
npm run start
```

### Deployment Platforms
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- DigitalOcean App Platform

## Contributing

This is an academic project (CAT 1 Group Work).

**Team Size**: Maximum 5 students per group

## Project Evaluation Criteria

- **Application Functionality** (8 marks): Working as expected
- **Question Handling** (4 marks): Well-answered queries
- **Team Presence** (4 marks): All members present
- **UI Neatness** (4 marks): Clean, professional interfaces

**Total**: 20 marks

## License

This project is created for educational purposes.

## Contact

For questions or issues, contact the development team.

---

**Last Updated**: January 2026  
**Version**: 1.0.0  
**Status**: In Development