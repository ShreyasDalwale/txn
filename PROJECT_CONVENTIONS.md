# Project Conventions

## 🎯 Project Overview

This is a React + Vite expense tracker app using Firebase for backend services. All conventions should align with this tech stack.

## 🏗️ Architecture Patterns

### Component Architecture
- **Presentational Components**: Focus on UI, receive data via props
- **Container Components**: Handle logic, data fetching, state management (via hooks)
- **Layout Components**: Handle page structure (Header, MainContent, etc.)
- **Feature Components**: Complete features (TransactionForm, TransactionList)

### Data Flow
```
User Action → Component → Service → Firebase → Service → Hook → Component → UI Update
```

### State Management Strategy
1. **Local State**: Component-specific UI (modals, forms, toggles)
2. **Custom Hooks**: Shared data and logic (useAuth, useTransactions)
3. **Context**: Global state if needed (currently not used, keep it simple)

## 📁 Project Structure

```
txn/
├── public/                   # Static assets
├── src/
│   ├── components/          # React components + CSS
│   │   ├── Header.jsx
│   │   ├── Header.css
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.js
│   │   └── useTransactions.js
│   ├── services/           # Business logic & API
│   │   ├── auth.js
│   │   └── firebase/
│   │       └── firebase.js
│   ├── constants/          # App constants
│   │   └── categories.js
│   ├── utils/             # Utility functions (if needed)
│   ├── App.jsx            # Main app component
│   ├── App.css
│   ├── index.css          # Global styles
│   └── main.jsx           # Entry point
├── .env                   # Environment variables (gitignored)
├── .env.example          # Template
├── package.json
└── vite.config.js
```

## 🎨 Styling Conventions

### CSS Organization
- **One CSS file per component** (co-located)
- **Global styles** in `index.css`
- **App-level styles** in `App.css`
- **No CSS-in-JS** libraries (keep it simple with plain CSS)

### Class Naming
```css
/* Component name prefix */
.transaction-form {}
.transaction-form-container {}
.transaction-form-title {}

/* Generic utility classes */
.btn {}
.btn-primary {}
.btn-secondary {}
.btn-submit {}

/* State classes */
.is-active {}
.is-loading {}
.has-error {}
```

### CSS Variables (if needed)
```css
:root {
  --primary-color: #667eea;
  --error-color: #ef4444;
  --spacing-md: 1rem;
}
```

## 🔥 Firebase Conventions

### Collections
- **transactions**: User transaction records
- **users**: User profile data

### Document Structure
```javascript
// transactions/{id}
{
  id: string,
  userId: string,           // Always include for filtering
  amount: number,
  type: 'income' | 'expense',
  category: string,
  description: string,
  date: string,             // ISO format
  is_deleted: boolean,      // Soft delete flag
  created_at: timestamp,
  updated_at: timestamp,
  deleted_at: timestamp,
}
```

### Querying Patterns
```javascript
// Always filter by userId
const q = query(
  collection(db, 'transactions'),
  where('userId', '==', userId),
  where('is_deleted', '==', false),
  orderBy('created_at', 'desc'),
  limit(50)
);
```

### Service Functions
```javascript
// Named exports for service functions
export const addTransaction = async (data) => { /*...*/ };
export const updateTransaction = async (id, data) => { /*...*/ };
export const deleteTransaction = async (id) => { /*...*/ };

// Default export for initialization
export default { init, db, auth };
```

## 🔐 Security Conventions

### Environment Variables
- **Naming**: `VITE_*` prefix for Vite to expose them
- **Storage**: `.env` file (gitignored)
- **Access**: `import.meta.env.VITE_VARIABLE_NAME`

### Authentication
- **Always check**: User authentication before CRUD operations
- **Always filter**: Data by userId
- **Never expose**: Other users' data

### Firestore Rules
```javascript
// Transactions: Users can only access their own
match /transactions/{id} {
  allow read, write: if request.auth.uid == resource.data.userId;
}
```

## 📝 Naming Conventions

### Files
- **Components**: `PascalCase.jsx` (e.g., `TransactionList.jsx`)
- **Hooks**: `camelCase.js` with `use` prefix (e.g., `useAuth.js`)
- **Services**: `camelCase.js` (e.g., `firebase.js`, `auth.js`)
- **Constants**: `camelCase.js` (e.g., `categories.js`)
- **CSS**: Match component name (e.g., `TransactionList.css`)

### Variables & Functions
```javascript
// Components
const TransactionForm = () => {};

// Hooks
const useTransactions = () => {};

// Service functions
const addTransaction = () => {};
const fetchUserData = () => {};

// Event handlers
const handleSubmit = () => {};
const handleDelete = () => {};

// Boolean variables
const isLoading = false;
const hasError = false;
const shouldShow = true;

// Constants
const MAX_TRANSACTIONS = 100;
const API_ENDPOINT = 'https://api.example.com';
```

## 🔄 Git Conventions

### Branch Naming
- **Feature**: `feature/transaction-filters`
- **Fix**: `fix/form-validation`
- **Chore**: `chore/update-dependencies`

### Commit Messages
```
feat: add transaction filtering
fix: resolve form validation issue
chore: update dependencies
docs: update README
style: format code
refactor: reorganize components
```

### What to Commit
- ✅ Source code
- ✅ Package.json
- ✅ Configuration files
- ✅ Documentation
- ❌ .env file
- ❌ node_modules
- ❌ dist folder
- ❌ IDE settings

## 🧪 Testing Conventions (Future)

### File Naming
- `ComponentName.test.jsx` or `ComponentName.spec.jsx`
- Place next to the component being tested

### Test Structure
```javascript
describe('TransactionForm', () => {
  it('should render form fields', () => {});
  it('should validate amount input', () => {});
  it('should submit form data', () => {});
});
```

## 📦 Dependency Management

### Adding Dependencies
1. Check if really needed
2. Check bundle size
3. Check maintenance status
4. Add to package.json
5. Document in README if significant

### Current Dependencies
- **react**: UI framework
- **firebase**: Backend services
- **prop-types**: Runtime type checking
- **vite**: Build tool

### Keep Minimal
- Don't add libraries for simple tasks
- Prefer native solutions when possible
- Consider bundle size impact

## 🚀 Deployment Conventions

### Build Process
```bash
npm run build        # Production build
npm run preview     # Preview production build
```

### Environment-Specific Files
- `.env.development` - Local development
- `.env.production` - Production (on hosting platform)

### Deployment Checklist
- [ ] Environment variables set
- [ ] Build completes successfully
- [ ] No console errors
- [ ] Firebase security rules updated
- [ ] Authorized domains added
- [ ] Test in production

## 📚 Documentation

### Required Documentation Files
- `README.md` - Project overview and setup
- `DEPLOYMENT.md` - Deployment instructions
- `IMPROVEMENTS.md` - Changelog
- `UI_PREFERENCES.md` - Design system
- `CODING_STANDARDS.md` - Code conventions
- `PROJECT_CONVENTIONS.md` - This file

### Code Comments
```javascript
// Good: Explains WHY
// Using setTimeout to debounce rapid clicks
setTimeout(() => handleClick(), 300);

// Bad: Explains WHAT (obvious)
// Set count to 0
setCount(0);
```

### README Structure
1. Project title and description
2. Features list
3. Installation instructions
4. Usage guide
5. Project structure
6. Tech stack
7. Contributing guidelines
8. License

## 🎯 Performance Conventions

### Optimization Priorities
1. Minimize re-renders
2. Lazy load heavy components
3. Optimize images
4. Use proper keys in lists
5. Memoize expensive calculations

### What NOT to Optimize
- Don't micro-optimize early
- Don't add complexity for marginal gains
- Measure before optimizing

## ♿ Accessibility Conventions

### Semantic HTML
```javascript
// Use proper HTML elements
<button> not <div onClick>
<input> with <label>
<nav>, <main>, <header>, <footer>
```

### Keyboard Navigation
- All interactive elements focusable
- Proper tab order
- Visible focus indicators

### ARIA Labels (when needed)
```javascript
<button aria-label="Delete transaction">🗑️</button>
```

## 🐛 Error Handling Patterns

### User-Facing Errors
```javascript
try {
  await someOperation();
} catch (error) {
  // Show user-friendly message
  setError('Something went wrong. Please try again.');
  // Log technical details
  console.error('Operation failed:', error);
}
```

### Developer Errors
```javascript
if (!userId) {
  throw new Error('userId is required');
}
```

## 🔄 State Update Patterns

### Async State Updates
```javascript
const handleSubmit = async () => {
  setLoading(true);
  setError(null);
  
  try {
    await submitData();
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

### Form State
```javascript
// Object state for forms
const [formData, setFormData] = useState({
  amount: '',
  category: '',
  date: '',
});

// Update function
const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};
```

## 📱 Mobile-First Conventions

### Development Approach
1. Design for mobile first
2. Enhance for larger screens
3. Test on actual devices

### Breakpoints
```css
/* Mobile first - base styles */
.component { /* mobile styles */ }

/* Tablet and up */
@media (min-width: 768px) {
  .component { /* tablet styles */ }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .component { /* desktop styles */ }
}
```

## ✅ Code Review Checklist

Before PR/Merge:
- [ ] Code follows project conventions
- [ ] PropTypes added to components
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Mobile responsive
- [ ] No console errors
- [ ] No unused code/imports
- [ ] Documentation updated if needed
- [ ] Tested in development
- [ ] Git commit messages clear

## 🎉 New Feature Workflow

1. **Plan**: Document requirements
2. **Create**: Build in feature branch
3. **Test**: Test thoroughly
4. **Document**: Update docs if needed
5. **Review**: Self-review checklist
6. **Merge**: Merge to main
7. **Deploy**: Deploy and verify

## 📞 Getting Help

- Check existing documentation first
- Review similar existing code
- Ask for clarification if conventions unclear
- Suggest improvements to conventions

---

**Remember**: Conventions exist to make development easier, not harder. When in doubt, prefer:
- Simplicity over cleverness
- Clarity over brevity
- Consistency over personal preference
- Working code over perfect code
