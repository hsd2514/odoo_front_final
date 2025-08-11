# 🛍️ **E-Commerce Rental Platform**

A modern, professional e-commerce platform built with React, featuring product rentals, user management, and comprehensive admin controls.

## ✨ **Features**

### **Core E-Commerce**
- 🏠 **Home Page**: Professional product grid with filters, search, and view toggles
- 📦 **Product Management**: Detailed product cards with pricing, images, and wishlist
- 🛒 **Shopping Cart**: Date-based rental cart with quantity management
- 💳 **Checkout Flow**: Multi-step checkout (delivery → payment) with validation
- ❤️ **Wishlist**: Save and manage favorite products
- 🔍 **Search & Filters**: Advanced filtering by category, price, and availability

### **Engagement & Loyalty** 🆕
- 🎯 **Promotions System**: Dynamic coupon codes with percentage/fixed discounts
- ⭐ **Loyalty Points**: Earn points on purchases (10 points per order)
- 🔔 **Notifications**: Automated return reminders and system notifications
- 💰 **Smart Pricing**: Real-time discount calculations and total updates

### **Admin Console** 🆕
- 👥 **Role Management**: Create, assign, and manage user roles
- 📦 **Catalog Management**: CRUD operations for categories and products
- 🏪 **Inventory Management**: Track item status (available → reserved → rented)
- 📅 **Rental Operations**: Schedule management and handover QR codes
- 📊 **Analytics Dashboard**: Revenue, active rentals, and user metrics

### **User Experience**
- 🎨 **Professional Design**: Clean, modern UI with consistent color palette
- 📱 **Responsive Layout**: Mobile-first design with adaptive grids
- ⚡ **Real-time Updates**: Live cart updates and validation feedback
- 🔒 **Form Validation**: Comprehensive input validation with error messages
- 🎯 **Accessibility**: Proper contrast, focus states, and semantic markup

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 16+ 
- npm or yarn

### **Installation**
```bash
# Clone the repository
git clone <your-repo-url>
cd odoo_final

# Install dependencies
npm install

# Start development server
npm run dev
```

### **Environment Setup**
Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=E-Commerce Platform
```

## 🏗️ **Architecture**

### **Frontend Structure**
```
src/
├── components/          # Reusable UI components
├── context/            # React Context for state management
├── data/               # Static data and mock APIs
├── layouts/            # Page layout components
├── pages/              # Main application pages
├── services/           # API service layer
└── utils/              # Utility functions and helpers
```

### **Key Components**
- **ProductCard**: Professional product display with pricing
- **ProductGrid**: Responsive grid layout with error handling
- **CouponBox**: Enhanced promotions system integration
- **LoyaltyDisplay**: User loyalty points and rewards
- **AdminConsole**: Role-guarded administrative interface

### **State Management**
- **ShopContext**: Global state for cart, wishlist, and products
- **Local Storage**: Persistent cart and user preferences
- **API Integration**: RESTful services with error handling

## 🎨 **Design System**

### **Color Palette**
- **Primary**: `#F9DE66` (Yellow) - Main brand color
- **Secondary**: `#FFB74D` (Orange) - Accent elements
- **Success**: `#4CAF50` (Green) - Positive actions
- **Warning**: `#FF5722` (Red) - Errors and alerts
- **Neutral**: `#9E9E9E` (Gray) - Text and borders

### **Typography**
- **Headings**: Inter font family, bold weights
- **Body**: System fonts for optimal readability
- **Sizes**: Responsive scale from xs to 2xl

### **Spacing & Layout**
- **Grid System**: 12-column responsive grid
- **Spacing Scale**: 4px base unit (4, 8, 12, 16, 20, 24, 32, 48, 64)
- **Border Radius**: Consistent 8px, 12px, 16px, 24px

## 🔌 **API Integration**

### **Core Endpoints**
```
GET    /catalog/products          # Product listing with filters
GET    /catalog/products/{id}     # Product details
POST   /rentals/orders            # Create rental order
POST   /billing/invoices          # Generate invoice
POST   /billing/payments          # Process payment
```

### **Engagement APIs** 🆕
```
GET    /engage/promotions         # Available promotions
POST   /engage/promotions         # Apply promotion code
POST   /engage/loyalty            # Create/fetch loyalty account
POST   /engage/loyalty/{id}/earn  # Earn loyalty points
POST   /utility/notifications     # Create notifications
```

### **Admin APIs** 🆕
```
GET    /roles                     # List all roles
POST   /roles                     # Create new role
POST   /roles/assign              # Assign role to user
POST   /catalog/categories        # Create category
POST   /catalog/products          # Create product
POST   /inventory/items           # Create inventory item
PATCH  /inventory/items/{id}/status # Update item status
```

## 🛡️ **Security & Validation**

### **Form Validation**
- **Required Fields**: Real-time validation with error messages
- **Format Validation**: Phone, email, credit card, postal code
- **Credit Card**: Luhn algorithm verification
- **Error Handling**: User-friendly error messages and styling

### **Access Control**
- **Role-based Access**: Admin-only admin console
- **Route Protection**: Guarded routes with role checks
- **API Security**: JWT-based authentication
- **Input Sanitization**: XSS prevention and data validation

## 📱 **Responsive Design**

### **Breakpoints**
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+
- **Large**: 1280px+

### **Grid System**
- **Mobile**: 2 columns
- **Tablet**: 3-4 columns
- **Desktop**: 4-6 columns
- **Large**: 6+ columns

## 🧪 **Testing & Quality**

### **Code Quality**
- **ESLint**: Code linting and formatting
- **Prettier**: Consistent code style
- **TypeScript**: Type safety (optional)
- **Error Boundaries**: Graceful error handling

### **Performance**
- **Lazy Loading**: Component and route lazy loading
- **Memoization**: React.memo and useMemo optimization
- **Bundle Splitting**: Code splitting for better performance
- **Image Optimization**: Responsive images and lazy loading

## 🚀 **Deployment**

### **Build Process**
```bash
# Production build
npm run build

# Preview build
npm run preview

# Analyze bundle
npm run analyze
```

### **Deployment Options**
- **Vercel**: Zero-config deployment
- **Netlify**: Static site hosting
- **AWS S3**: Cloud storage with CloudFront
- **Docker**: Containerized deployment

## 📚 **Documentation**

### **Component API**
Each component includes:
- **Props**: Type definitions and descriptions
- **Examples**: Usage examples and code snippets
- **Styling**: Available CSS classes and customization
- **Accessibility**: ARIA labels and keyboard navigation

### **State Management**
- **Context Usage**: How to use ShopContext
- **Local Storage**: Data persistence patterns
- **API Calls**: Service layer integration
- **Error Handling**: Error boundaries and fallbacks

## 🤝 **Contributing**

### **Development Workflow**
1. **Fork** the repository
2. **Create** a feature branch
3. **Implement** your changes
4. **Test** thoroughly
5. **Submit** a pull request

### **Code Standards**
- **ESLint**: Follow linting rules
- **Prettier**: Use consistent formatting
- **Commits**: Conventional commit messages
- **Testing**: Include tests for new features

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **React Team**: For the amazing framework
- **Tailwind CSS**: For the utility-first CSS framework
- **Vite**: For the fast build tool
- **Community**: For contributions and feedback

---

**Built with ❤️ using modern web technologies**
