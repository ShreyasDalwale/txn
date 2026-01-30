# 📁 Project Structure Overview

```
txn/
├── 📄 .env                          # Environment variables (NOT in git)
├── 📄 .env.example                  # Template for environment variables
├── 📄 .gitignore                    # Git ignore file (includes .env)
├── 📄 package.json                  # Project dependencies
├── 📄 vite.config.js               # Vite configuration
├── 📄 index.html                    # HTML entry point
│
├── 📚 Documentation
│   ├── 📄 README.md                 # Main project documentation
│   ├── 📄 IMPROVEMENTS.md           # Detailed improvements log
│   ├── 📄 DEPLOYMENT.md            # Deployment guide
│   └── 📄 CHECKLIST.md             # Production checklist
│
├── 📁 public/                       # Static assets
│
└── 📁 src/
    ├── 📄 main.jsx                  # React entry point
    ├── 📄 App.jsx                   # Main App component ⭐
    ├── 📄 App.css                   # App-level styles
    ├── 📄 index.css                 # Global styles
    │
    ├── 📁 components/               # React Components
    │   ├── 📄 Header.jsx            # App header with auth
    │   ├── 📄 Header.css
    │   ├── 📄 Stats.jsx             # Statistics dashboard
    │   ├── 📄 Stats.css
    │   ├── 📄 TransactionForm.jsx   # Add transaction form
    │   ├── 📄 TransactionForm.css
    │   ├── 📄 TransactionList.jsx   # Transaction list with edit/delete
    │   └── 📄 TransactionList.css
    │
    ├── 📁 hooks/                    # Custom React Hooks
    │   ├── 📄 useAuth.js            # Authentication hook
    │   └── 📄 useTransactions.js    # Transactions data hook
    │
    ├── 📁 services/                 # Service Layer
    │   ├── 📄 auth.js               # Authentication service
    │   └── 📁 firebase/
    │       └── 📄 firebase.js       # Firebase config & operations
    │
    ├── 📁 constants/                # App Constants
    │   └── 📄 categories.js         # Transaction categories
    │
    └── 📁 assets/                   # Images, icons, etc.
```

## 🎯 Key Files Explained

### Configuration Files

**`.env`** (Not in Git)
```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
# ... other Firebase config
```

**`vite.config.js`**
- Vite build configuration
- React plugin setup
- Path aliases (if any)

**`package.json`**
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "firebase": "^10.10.0",
    "prop-types": "latest"
  }
}
```

### Entry Points

**`index.html`**
- HTML template
- Loads main.jsx

**`src/main.jsx`**
- React app initialization
- Renders App component
- Imports global styles

### Main Application

**`src/App.jsx`** ⭐ Main Component
```jsx
- Uses useAuth hook
- Uses useTransactions hook
- Shows Header
- Shows Stats (if authenticated)
- Shows TransactionForm (if authenticated)
- Shows TransactionList (if authenticated)
- Shows Welcome screen (if not authenticated)
```

### Components Layer

**Header.jsx**
- App branding
- User info display
- Sign in/out button

**Stats.jsx**
- Income calculation
- Expenses calculation
- Balance calculation
- Three stat cards

**TransactionForm.jsx**
- Form with validation
- Type selector
- Category dropdown
- Amount input
- Date picker
- Description field
- Submit handling

**TransactionList.jsx**
- List of transactions
- Edit functionality
- Delete functionality
- Empty state
- Loading state

### Hooks Layer

**useAuth.js**
```javascript
- Listens to Firebase auth state
- Returns: { user, loading }
- Used by: App.jsx
```

**useTransactions.js**
```javascript
- Fetches user's transactions
- Returns: { transactions, loading, error, refetch }
- Used by: App.jsx
```

### Services Layer

**auth.js**
```javascript
- signInWithGoogle()
- logout()
- saveUser()
```

**firebase/firebase.js**
```javascript
- Firebase initialization
- addTxn()
- findAllTxn()
- findTxn()
- updateTxn()
- softDeleteTxn()
```

### Constants

**categories.js**
```javascript
- TRANSACTION_CATEGORIES array
- TRANSACTION_TYPES array
```

## 🔄 Data Flow

```
User Action
    ↓
Component
    ↓
Service Function
    ↓
Firebase/Firestore
    ↓
Database
    ↓
Service Function Returns
    ↓
Hook Updates State
    ↓
Component Re-renders
    ↓
UI Updates
```

### Example: Adding a Transaction

```
1. User fills TransactionForm
2. User clicks "Add Transaction"
3. TransactionForm calls addTxn() from firebase.js
4. addTxn() sends data to Firestore
5. Firestore saves transaction
6. addTxn() returns success
7. TransactionForm calls onTransactionAdded()
8. onTransactionAdded triggers refetch()
9. useTransactions hook fetches updated data
10. App.jsx receives new transactions
11. TransactionList re-renders with new data
12. Stats recalculates totals
13. User sees updated UI
```

## 🎨 Styling Approach

- **Global Styles**: `index.css`
  - CSS reset
  - Root variables
  - Body styles
  - Scrollbar styles

- **App Styles**: `App.css`
  - Main layout
  - Loading screen
  - Welcome section

- **Component Styles**: Individual CSS files
  - Header.css
  - Stats.css
  - TransactionForm.css
  - TransactionList.css

### CSS Organization
```
Component.css structure:
1. Container/wrapper styles
2. Layout styles (flexbox/grid)
3. Typography styles
4. Color/theming
5. Interactive states (:hover, :focus)
6. Animations
7. Media queries (responsive)
```

## 🔒 Security Architecture

```
Frontend (React)
    ↓ Uses
Firebase SDK
    ↓ Authenticates with
Firebase Auth
    ↓ Requests data from
Firestore
    ↓ Checks
Security Rules
    ↓ If authorized
Returns Data
```

### Security Rules Flow

```javascript
User requests transaction
    ↓
Firestore checks: Is user authenticated?
    ↓ Yes
Firestore checks: Does userId match?
    ↓ Yes
Firestore checks: Is transaction not deleted?
    ↓ Yes
Return transaction
```

## 🚀 Build Process

```
Development:
npm run dev
    ↓
Vite dev server
    ↓
Hot Module Replacement
    ↓
Live updates

Production:
npm run build
    ↓
Vite builds app
    ↓
Optimizes & bundles
    ↓
Outputs to dist/
    ↓
dist/
├── index.html
├── assets/
│   ├── index.[hash].js
│   └── index.[hash].css
└── ...
```

## 📊 Component Hierarchy

```
App
├── Header
│   ├── Logo
│   └── UserInfo
│       ├── Avatar
│       └── SignInButton / SignOutButton
│
└── MainContent
    ├── Stats (if authenticated)
    │   ├── IncomeCard
    │   ├── ExpenseCard
    │   └── BalanceCard
    │
    ├── TransactionForm (if authenticated)
    │   ├── TypeSelect
    │   ├── AmountInput
    │   ├── CategorySelect
    │   ├── DateInput
    │   ├── DescriptionInput
    │   └── SubmitButton
    │
    ├── TransactionList (if authenticated)
    │   └── TransactionItem (multiple)
    │       ├── TransactionIcon
    │       ├── TransactionDetails
    │       ├── TransactionAmount
    │       └── TransactionActions
    │           ├── EditButton
    │           └── DeleteButton
    │
    └── WelcomeSection (if not authenticated)
        ├── WelcomeTitle
        ├── WelcomeText
        └── FeaturesList
```

## 🎯 Import Flow

```javascript
// App.jsx imports:
import Header from './components/Header'
import Stats from './components/Stats'
import TransactionForm from './components/TransactionForm'
import TransactionList from './components/TransactionList'
import { useAuth } from './hooks/useAuth'
import { useTransactions } from './hooks/useTransactions'

// Components import:
import { auth functions } from '../services/auth'
import { firebase functions } from '../services/firebase/firebase'
import { constants } from '../constants/categories'

// Everything eventually imports from:
import { firebase } from 'firebase/...'
import React from 'react'
```

## 🌟 Best Practices Implemented

✅ **Component Composition**: Small, focused components
✅ **Custom Hooks**: Reusable logic extraction
✅ **Service Layer**: Separation of business logic
✅ **PropTypes**: Runtime type checking
✅ **Error Boundaries**: Graceful error handling
✅ **Loading States**: Better UX
✅ **Modular CSS**: Scoped component styles
✅ **Environment Variables**: Secure configuration
✅ **Clean Architecture**: Clear separation of concerns

---

This structure ensures:
- 🎯 **Maintainability**: Easy to find and modify code
- 🔄 **Scalability**: Easy to add new features
- 🧪 **Testability**: Each part can be tested independently
- 📚 **Readability**: Clear organization and naming
- 🔒 **Security**: Proper separation of sensitive data
