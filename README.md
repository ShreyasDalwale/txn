# 💰 Expense Tracker

A modern, production-ready expense tracking application built with React, Vite, and Firebase.

## ✨ Features

- **🔐 Google Authentication** - Secure sign-in with Google
- **💸 Transaction Management** - Add, edit, and delete income/expense transactions
- **📊 Real-time Statistics** - View total income, expenses, and balance
- **🏷️ Categories** - Organize transactions with predefined categories
- **📅 Date Tracking** - Record transactions with specific dates
- **📝 Descriptions** - Add optional descriptions to transactions
- **🎨 Modern UI** - Beautiful gradient design with smooth animations
- **📱 Responsive** - Works seamlessly on desktop and mobile devices
- **🔄 Real-time Sync** - Data synced across devices via Firebase

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd txn
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## 🏗️ Project Structure

```
txn/
├── src/
│   ├── components/          # React components
│   │   ├── Header.jsx
│   │   ├── Stats.jsx
│   │   ├── TransactionForm.jsx
│   │   └── TransactionList.jsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.js
│   │   └── useTransactions.js
│   ├── services/            # Service layer
│   │   ├── auth.js
│   │   └── firebase/
│   │       └── firebase.js
│   ├── constants/           # App constants
│   │   └── categories.js
│   ├── App.jsx             # Main app component
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── .env                    # Environment variables (not in git)
├── .env.example           # Example environment file
└── package.json

```

## 🎨 UI Components

### Header
- App branding
- User authentication status
- Sign in/Sign out button
- User avatar and name display

### Stats Dashboard
- **Income** - Total income with green indicator
- **Expenses** - Total expenses with red indicator
- **Balance** - Net balance (income - expenses)

### Transaction Form
- Type selector (Income/Expense)
- Amount input with validation
- Category dropdown (context-aware based on type)
- Date picker
- Optional description field
- Submit button with loading state

### Transaction List
- Scrollable list of all transactions
- Edit functionality (inline editing)
- Delete functionality (soft delete with confirmation)
- Color-coded amounts (green for income, red for expenses)
- Category icons and labels
- Date display

## 🔥 Firebase Structure

### Collections

#### `transactions`
```javascript
{
  id: string,              // Auto-generated document ID
  userId: string,          // User's UID from Firebase Auth
  amount: number,          // Transaction amount
  type: string,            // 'income' or 'expense'
  category: string,        // Category value
  description: string,     // Optional description
  date: string,            // ISO date string
  is_deleted: boolean,     // Soft delete flag
  created_at: timestamp,   // Server timestamp
  updated_at: timestamp,   // Update timestamp
  deleted_at: timestamp    // Deletion timestamp (if deleted)
}
```

#### `users`
```javascript
{
  uid: string,             // User's Firebase UID
  name: string,            // Display name
  email: string,           // Email address
  photo: string,           // Photo URL
  lastLogin: timestamp     // Last login timestamp
}
```

## 📦 Dependencies

- **react** - UI framework
- **firebase** - Backend and authentication
- **react-hook-form** - Form handling
- **vite** - Build tool and dev server

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎯 Production Improvements Made

### Security
- ✅ Moved Firebase config to environment variables
- ✅ Added `.env` to `.gitignore`
- ✅ Implemented user authentication
- ✅ User-specific data filtering

### Code Quality
- ✅ Organized components into proper folders
- ✅ Created custom hooks for reusability
- ✅ Proper error handling and loading states
- ✅ Fixed Firebase import issues
- ✅ Removed unused code and files
- ✅ Added proper TypeScript-ready structure

### UI/UX
- ✅ Modern gradient design
- ✅ Smooth animations and transitions
- ✅ Responsive layout for all devices
- ✅ Loading states and spinners
- ✅ Empty states with helpful messages
- ✅ Form validation with error messages
- ✅ Success feedback on actions

### Features
- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Soft delete (recoverable deletions)
- ✅ Real-time statistics dashboard
- ✅ Transaction categorization
- ✅ Date tracking
- ✅ Inline editing
- ✅ User-specific data

## 🔒 Security Notes

- Never commit the `.env` file to version control
- Use Firebase Security Rules to protect your database
- Implement proper authentication checks on the backend

### Recommended Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /transactions/{transaction} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.userId;
    }
    
    match /users/{userId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == userId;
    }
  }
}
```

## 📝 License

MIT

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

Your Name

---

Made with ❤️ using React and Firebase

