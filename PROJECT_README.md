# BookIt: Experiences & Slots

A modern, full-stack experience booking application built with React, TypeScript, and Supabase.

## 🚀 Live Demo

The application is hosted and can be accessed at: [Your Lovable Project URL]

## ✨ Features

### Frontend
- **Home Page**: Browse all available experiences with search functionality
- **Experience Details**: View detailed information with date and time slot selection
- **Checkout Page**: Secure booking form with promo code validation
- **Confirmation Page**: Booking success with complete details
- **Responsive Design**: Mobile-friendly layout using TailwindCSS
- **Real-time Updates**: Dynamic slot availability and booking management

### Backend (Supabase)
- **Database**: PostgreSQL with complete schema
- **RLS Policies**: Row-level security for data protection
- **API Endpoints**:
  - GET /experiences - Fetch all experiences
  - GET /experiences/:id - Get experience details
  - GET /slots - Fetch available time slots
  - POST /bookings - Create new bookings
  - POST /promo_codes validation - Validate promo codes

### Design System
- **Primary Color**: Vibrant gold/yellow (#FFB800) for CTAs
- **Typography**: Clean, modern sans-serif
- **Components**: Custom shadcn/ui components with semantic tokens
- **Animations**: Smooth hover transitions and interactions

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS with custom design system
- **Backend**: Supabase (PostgreSQL + RLS)
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router v6
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation
- **Notifications**: Sonner (Toast notifications)

## 📦 Database Schema

### Tables
1. **experiences**: Store travel experiences
   - id, title, description, location, duration, price, image_url, category
   
2. **slots**: Manage available time slots
   - id, experience_id, date, time, available_seats, booked_seats
   
3. **bookings**: Store customer bookings
   - id, experience_id, slot_id, user details, pricing, promo_code
   
4. **promo_codes**: Manage discount codes
   - id, code, discount_type, discount_value, active

### Sample Promo Codes
- `SAVE10` - 10% discount
- `FLAT100` - ₹100 flat discount
- `WELCOME20` - 20% discount

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account (already configured)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd experience-booker-app
```

2. Install dependencies:
```bash
npm install
```

3. Environment variables are pre-configured in the project

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:8080](http://localhost:8080) in your browser

## 📱 Application Flow

1. **Browse Experiences**: Users land on the home page and browse available experiences
2. **Search & Filter**: Use the search bar to find specific experiences
3. **Select Experience**: Click on any experience to view details
4. **Choose Date & Time**: Select preferred date and available time slot
5. **Enter Details**: Fill in contact information and optional promo code
6. **Confirm Booking**: Review summary and complete booking
7. **Get Confirmation**: Receive booking confirmation with unique ID

## 🎨 Design Philosophy

The application follows a clean, modern design inspired by leading travel booking platforms:
- Card-based layouts for easy scanning
- Bright yellow CTAs for clear action points
- Generous white space for readability
- Smooth transitions for professional feel
- Mobile-first responsive design

## 🔒 Security Features

- Row-Level Security (RLS) policies on all tables
- Input validation on forms
- Secure promo code validation
- Protected routes and API endpoints
- No exposed sensitive data

## 🧪 Testing

To test the complete booking flow:
1. Browse experiences on the home page
2. Click "Book Now" on any experience
3. Select a future date from the calendar
4. Choose an available time slot
5. Adjust number of people
6. Proceed to checkout
7. Fill in your details
8. Try promo code: `SAVE10` or `FLAT100`
9. Confirm booking
10. View confirmation page

## 📊 API Endpoints

All endpoints are automatically managed through Supabase:

```typescript
// Get all experiences
GET /rest/v1/experiences

// Get specific experience
GET /rest/v1/experiences?id=eq.{id}

// Get slots for experience
GET /rest/v1/slots?experience_id=eq.{id}&date=eq.{date}

// Create booking
POST /rest/v1/bookings

// Validate promo code
GET /rest/v1/promo_codes?code=eq.{code}&active=eq.true
```

## 🌟 Key Features

### Double-Booking Prevention
The system automatically updates slot availability when bookings are made, preventing double-bookings.

### Dynamic Pricing
Promo codes support both percentage and fixed amount discounts, calculated in real-time.

### Responsive Design
Fully responsive across desktop, tablet, and mobile devices with optimized layouts.

### Error Handling
Comprehensive error handling with user-friendly toast notifications.

## 🚢 Deployment

The application is deployed on Lovable's hosting platform. To deploy updates:
1. Push changes to the repository
2. Lovable automatically deploys changes
3. Visit your project URL to see updates

## 📝 License

This project was created as a demonstration application.

## 🤝 Contributing

Feel free to fork this project and submit pull requests for any improvements!

## 📞 Support

For issues or questions, please open an issue in the repository.

---

Built with ❤️ using React, TypeScript, and Supabase
