# Mkulima Sharp - Professional Poultry Farming Platform

A world-class agricultural e-commerce platform serving Kenyan poultry farmers with seamless product purchasing, educational excellence, and professional logistics management.

## 🎯 Project Vision

Transform Mkulima Sharp into a comprehensive digital ecosystem that provides:
- **Seamless product purchasing** (chicks, equipment, feeds, supplements)
- **Educational excellence** through Mkulima Sharp Academy
- **Professional logistics management** with multi-role admin systems
- **Secure M-Pesa payment integration**
- **Outstanding mobile-first user experience**

## 🚀 Technology Stack

### Frontend
- **React 19** - Latest React with improved performance
- **React Router DOM 7** - Multi-page navigation
- **TailwindCSS 3** - Utility-first styling with custom design system
- **Framer Motion** - Advanced animations
- **React Hook Form** - Form management
- **Zustand** - State management

### Backend (Firebase Serverless)
- **Firebase Authentication** - User management & JWT
- **Cloud Firestore** - NoSQL database
- **Firebase Cloud Functions** - Serverless API endpoints
- **Firebase Storage** - Image and file uploads
- **Firebase Hosting** - Static site hosting
- **Firebase Cloud Messaging** - Push notifications

### Integrations
- **M-Pesa Daraja API** - Payment processing (via Cloud Functions)
- **Firebase Security Rules** - Role-based access control
- **Firebase Admin SDK** - Backend operations

## 📱 Mobile-First Design Philosophy

**CRITICAL**: This platform is designed mobile-first with 95% of users accessing via smartphones (320px-428px width).

### Design Principles
- Start all designs at 320px width
- Touch-friendly targets (minimum 48x48px)
- Progressive enhancement for larger screens
- Professional tone - NO EMOJIS
- Boxed content pattern (Kenchic-inspired)
- Scroll-reveal animations

### Performance Targets
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s on 3G
- Cumulative Layout Shift (CLS): < 0.1
- Time to Interactive (TTI): < 3.5s

## 🛠️ Installation

### Prerequisites
- Node.js 20.x or higher
- npm or yarn
- Firebase CLI (`npm install -g firebase-tools`)
- Git

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/mkulima-sharp.git
cd mkulima-sharp
```

2. **Install dependencies**
```bash
npm install
```

3. **Firebase Setup**
```bash
# Login to Firebase
firebase login

# Initialize Firebase (if not already done)
firebase init

# Select:
# - Hosting
# - Firestore
# - Functions
# - Storage
```

4. **Environment Variables**

Create `.env` file in the root:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

5. **Run Development Server**
```bash
npm run dev
```

Visit `http://localhost:3000`

## 📦 Build & Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Firebase
```bash
# Deploy everything
npm run deploy

# Deploy only hosting
npm run deploy:hosting

# Deploy only functions
npm run deploy:functions
```

### Firebase Hosting Configuration

The app uses Firebase Hosting with SPA routing configured in `firebase.json`:
- All routes redirect to `/index.html` for React Router
- Static assets cached for 1 year
- Optimized for CDN delivery

## 🏗️ Project Structure

```
mkulima-sharp/
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   │   ├── logo.svg
│   │   └── rooster-family.png
│   └── src/
│       ├── components/    # Reusable components
│       │   ├── layout/   # Navbar, Footer, Layout
│       │   └── common/   # Button, Card, AnimatedSection
│       ├── pages/        # Route pages
│       ├── hooks/        # Custom React hooks
│       ├── services/     # Firebase & API services
│       └── utils/        # Utility functions
├── functions/            # Firebase Cloud Functions
│   └── src/
│       ├── mpesa/       # M-Pesa integration
│       ├── orders/      # Order management
│       └── invoices/    # Invoice generation
├── firestore.rules      # Firestore security rules
├── storage.rules        # Storage security rules
└── firebase.json        # Firebase configuration
```

## 🔐 Security

### Firestore Security Rules
- Role-based access control (admin, customer, dispatcher, driver)
- Field-level security
- Data validation at database level

### Authentication
- Email/password authentication
- Phone number verification
- Custom claims for admin roles
- Session management

### Payment Security
- M-Pesa credentials in Cloud Functions environment
- Callback URL verification
- Idempotency keys
- Transaction logging

## 🎨 Design System

### Colors
- **Primary**: Green (#16a34a to #15803d) - Growth, trust
- **Secondary**: Amber (#f59e0b to #d97706) - Energy, harvest
- **Neutrals**: Gray-50 to gray-900

### Typography
- **Headings**: Playfair Display (serif elegance)
- **Body**: Inter (modern readability)
- **Mobile base**: 16px minimum (prevents zoom on iOS)

### Components
All components follow mobile-first, touch-optimized patterns:
- Minimum tap target: 48x48px
- Full-width buttons on mobile
- Generous padding and spacing
- Professional icons (NO EMOJIS)

## 📄 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run deploy` - Deploy to Firebase
- `npm run deploy:hosting` - Deploy only frontend
- `npm run deploy:functions` - Deploy only backend functions

## 🧪 Testing

### Device Testing Checklist
- [ ] iPhone SE (320px - smallest modern screen)
- [ ] Android low-end device
- [ ] 3G throttling in DevTools
- [ ] Touch interactions (not mouse)
- [ ] Portrait and landscape orientations
- [ ] No emojis anywhere on site
- [ ] Professional CTAs throughout
- [ ] Contrast ratios (4.5:1 minimum)

### Performance Testing
```bash
# Run Lighthouse audit
npm run build
npm run preview
# Then run Lighthouse in Chrome DevTools
```

## 🌐 Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- Mobile Safari iOS 12+
- Chrome Android

## 📚 Key Features

### For Customers
- Browse and purchase products
- Track orders in real-time
- Access educational content
- M-Pesa payment integration
- Responsive mobile experience

### For Admins
- Product management
- Order processing
- User management
- Analytics dashboard
- Role-based permissions

### Mkulima Sharp Academy
- Comprehensive poultry farming education
- Interactive calculators
- Downloadable resources
- Video content
- Success stories

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

- **Email**: info@mkulimasharp.co.ke
- **Phone**: +254 700 000 000
- **Website**: https://mkulimasharp.co.ke

## 📝 License

This project is proprietary and confidential.

## 🙏 Acknowledgments

- Design inspiration: Kenchic Kenya
- Firebase for serverless infrastructure
- React team for amazing framework
- Kenyan farmers for feedback and support

---

**Built with precision for Kenya's agricultural future** 🇰🇪

*Last updated: January 2025*
