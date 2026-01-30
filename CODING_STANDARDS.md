# Coding Standards & Logic Preferences

## 🎯 General Philosophy

- **Functional over Class**: Always use functional components
- **Composition over Inheritance**: Build complex UIs from simple components
- **Hooks over HOCs**: Use custom hooks for logic reuse
- **Explicit over Implicit**: Clear, readable code over clever code
- **Simple over Complex**: Prefer straightforward solutions

## ⚛️ React Patterns

### Components

**Component Structure**
```javascript
// 1. Imports (grouped)
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { externalFunction } from '../services/something';
import './Component.css';

// 2. Component definition
const ComponentName = ({ prop1, prop2 }) => {
  // 3. Hooks (in order)
  const [state, setState] = useState(initialValue);
  const customHook = useCustomHook();
  
  // 4. Event handlers
  const handleClick = () => {
    // logic
  };
  
  // 5. Effects
  useEffect(() => {
    // side effects
  }, [dependencies]);
  
  // 6. Computed values
  const computedValue = useMemo(() => {
    return expensiveOperation();
  }, [deps]);
  
  // 7. JSX return
  return (
    <div>
      {/* content */}
    </div>
  );
};

// 8. PropTypes
ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.func,
};

// 9. Export
export default ComponentName;
```

**Naming Conventions**
- Components: `PascalCase` (e.g., `TransactionForm.jsx`)
- Props: `camelCase` (e.g., `onTransactionAdded`)
- Hooks: `use` prefix + `PascalCase` (e.g., `useTransactions`)
- Event handlers: `handle` prefix + `PascalCase` (e.g., `handleSubmit`)
- Boolean props: `is/has/should` prefix (e.g., `isLoading`, `hasError`)

### Custom Hooks

**Hook Structure**
```javascript
export const useHookName = (param) => {
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // async operations
  }, [param]);
  
  // Return object with named properties
  return { state, loading, error, refetch };
};
```

**Rules**
- Always start with `use` prefix
- Return objects with named properties (not arrays unless tuple makes sense)
- Include loading and error states when dealing with async data
- Provide refetch/refresh functions when applicable
- Document dependencies clearly

### State Management

**Local State (useState)**
```javascript
// Use for: component-specific UI state
const [isOpen, setIsOpen] = useState(false);
const [formData, setFormData] = useState({ name: '', email: '' });
```

**Custom Hooks**
```javascript
// Use for: shared logic, data fetching, complex state
const { transactions, loading, refetch } = useTransactions(userId);
```

**Context (if needed)**
```javascript
// Use for: truly global state (theme, user, etc.)
const { user } = useAuth();
```

**Never use**: Class component state, Redux (unless absolutely necessary)

## 🔄 Async Operations & Data Fetching

### Error Handling

**Always use try-catch for async operations**
```javascript
const handleSubmit = async () => {
  try {
    setLoading(true);
    setError(null);
    await someAsyncOperation();
    // success handling
  } catch (err) {
    setError(err.message);
    console.error('Error description:', err);
    // user feedback
  } finally {
    setLoading(false);
  }
};
```

**Service Functions**
```javascript
// Throw errors, don't return false
export const addTransaction = async (data) => {
  try {
    const result = await api.post('/transactions', data);
    return result;
  } catch (error) {
    console.error('Failed to add transaction:', error);
    throw error; // Let caller handle it
  }
};
```

### Loading States

**Always show loading states**
```javascript
if (loading) {
  return <LoadingSpinner />;
}

if (error) {
  return <ErrorMessage message={error} />;
}

return <ActualContent />;
```

**Button loading states**
```javascript
<button disabled={loading} onClick={handleClick}>
  {loading ? 'Loading...' : 'Submit'}
</button>
```

## 📁 File Organization

### Folder Structure
```
src/
├── components/          # React components
│   ├── ComponentName.jsx
│   └── ComponentName.css
├── hooks/              # Custom hooks
│   └── useHookName.js
├── services/           # API calls, business logic
│   └── serviceName.js
├── constants/          # App constants
│   └── constantsName.js
├── utils/              # Utility functions
│   └── utilName.js
└── types/              # TypeScript types (if using TS)
    └── types.ts
```

### File Naming
- **Components**: `PascalCase.jsx` (e.g., `TransactionForm.jsx`)
- **Hooks**: `camelCase.js` (e.g., `useAuth.js`)
- **Services**: `camelCase.js` (e.g., `firebase.js`)
- **Utils**: `camelCase.js` (e.g., `formatDate.js`)
- **CSS**: Match component name (e.g., `TransactionForm.css`)

## 🎨 Styling

### CSS Organization

**One CSS file per component**
```
TransactionForm.jsx
TransactionForm.css
```

**CSS Class Naming**: Use BEM-like or descriptive names
```css
.transaction-form {}
.transaction-form-container {}
.transaction-form-title {}
.form-input {}
.btn-submit {}
```

**No inline styles** except for dynamic values
```javascript
// Avoid
<div style={{ color: 'red' }}>Text</div>

// Prefer
<div className="error-text">Text</div>

// OK for dynamic values
<div style={{ width: `${progress}%` }}>Progress</div>
```

## 🔍 PropTypes Validation

**Always add PropTypes to components**
```javascript
ComponentName.propTypes = {
  // Required props
  id: PropTypes.string.isRequired,
  
  // Optional props
  name: PropTypes.string,
  
  // Objects with shape
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
  }),
  
  // Arrays
  items: PropTypes.arrayOf(PropTypes.string),
  
  // Arrays of objects
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
    })
  ).isRequired,
  
  // Functions
  onClick: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  
  // Booleans
  isActive: PropTypes.bool,
  
  // One of
  status: PropTypes.oneOf(['pending', 'active', 'completed']),
};
```

## 🛡️ Error Handling

### Component Error Boundaries
```javascript
// Use error boundaries for component-level errors
<ErrorBoundary fallback={<ErrorFallback />}>
  <ComponentThatMightError />
</ErrorBoundary>
```

### User Feedback
```javascript
// Always show user-friendly messages
try {
  await deleteTransaction(id);
  showSuccessMessage('Transaction deleted successfully');
} catch (error) {
  showErrorMessage('Failed to delete transaction. Please try again.');
  console.error('Delete failed:', error);
}
```

### Validation
```javascript
// Validate before submission
const handleSubmit = (e) => {
  e.preventDefault();
  
  if (!amount || amount <= 0) {
    setError('Please enter a valid amount');
    return;
  }
  
  if (!category) {
    setError('Please select a category');
    return;
  }
  
  // Proceed with submission
};
```

## 📝 Comments & Documentation

### When to Comment
- **Complex logic**: Explain why, not what
- **Non-obvious solutions**: Why this approach was chosen
- **TODOs**: What needs to be done later
- **Workarounds**: Why a workaround is needed

### What NOT to Comment
- Obvious code: `// Set loading to true`
- Redundant: `const name = 'John'; // John's name`

### JSDoc for Functions
```javascript
/**
 * Calculates the total amount of transactions
 * @param {Array} transactions - Array of transaction objects
 * @param {string} type - 'income' or 'expense'
 * @returns {number} Total amount
 */
const calculateTotal = (transactions, type) => {
  return transactions
    .filter(t => t.type === type)
    .reduce((sum, t) => sum + t.amount, 0);
};
```

## 🔐 Security Best Practices

### Environment Variables
```javascript
// Use environment variables for sensitive data
const apiKey = import.meta.env.VITE_API_KEY;

// Never commit .env files
// Always provide .env.example
```

### User Input
```javascript
// Sanitize user input
const sanitizedInput = input.trim();

// Validate on frontend AND backend
if (!isValidEmail(email)) {
  setError('Invalid email format');
  return;
}
```

### Authentication
```javascript
// Check auth before sensitive operations
if (!user) {
  setError('You must be signed in');
  return;
}

// Filter data by user
const userTransactions = transactions.filter(t => t.userId === user.uid);
```

## 🎯 Performance

### Avoid Unnecessary Re-renders
```javascript
// Use memo for expensive computations
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);

// Use callback for functions passed to children
const handleClick = useCallback(() => {
  doSomething();
}, []);
```

### Lazy Loading
```javascript
// Lazy load components
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

<Suspense fallback={<Loading />}>
  <HeavyComponent />
</Suspense>
```

### Optimize Lists
```javascript
// Always use keys in lists
{items.map(item => (
  <Item key={item.id} data={item} />
))}

// Don't use index as key unless list is static
```

## 🧪 Code Quality

### DRY (Don't Repeat Yourself)
```javascript
// Bad: Repeated logic
const income = transactions.filter(t => t.type === 'income')
  .reduce((sum, t) => sum + t.amount, 0);
const expenses = transactions.filter(t => t.type === 'expense')
  .reduce((sum, t) => sum + t.amount, 0);

// Good: Extract to utility
const calculateTotal = (transactions, type) => {
  return transactions
    .filter(t => t.type === type)
    .reduce((sum, t) => sum + t.amount, 0);
};
```

### Single Responsibility
```javascript
// Each function/component should do ONE thing well
// Bad: Component does too much
const UserProfile = () => {
  // Fetches data
  // Handles authentication
  // Manages form
  // Handles file upload
  // etc.
};

// Good: Split into smaller components
const UserProfile = () => {
  return (
    <>
      <UserHeader />
      <UserForm />
      <UserSettings />
    </>
  );
};
```

### Early Returns
```javascript
// Use early returns for readability
const Component = ({ data, loading, error }) => {
  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!data) return <Empty />;
  
  return <Content data={data} />;
};
```

## 📦 Import Organization

```javascript
// 1. React and third-party imports
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// 2. Local components
import Header from './Header';
import Footer from './Footer';

// 3. Hooks
import { useAuth } from '../hooks/useAuth';
import { useTransactions } from '../hooks/useTransactions';

// 4. Services and utilities
import { addTransaction } from '../services/firebase';
import { formatDate } from '../utils/dateUtils';

// 5. Constants
import { CATEGORIES } from '../constants/categories';

// 6. Styles (always last)
import './Component.css';
```

## 🎨 Formatting Rules

- **Indentation**: 2 spaces
- **Quotes**: Single quotes for JS, double for JSX attributes
- **Semicolons**: Use them
- **Trailing commas**: Yes (makes diffs cleaner)
- **Line length**: Max 100 characters (soft limit)
- **Arrow functions**: Use for callbacks and short functions

## ✅ Before Committing

- [ ] No console.logs (except intentional logging)
- [ ] No unused imports
- [ ] No unused variables
- [ ] PropTypes added to all components
- [ ] Error handling in place
- [ ] Loading states implemented
- [ ] Code formatted consistently
- [ ] Comments for complex logic
- [ ] No hardcoded values (use constants)
