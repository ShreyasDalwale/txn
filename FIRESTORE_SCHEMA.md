# Firestore Collection Structure

## Collection Design for Expense Tracker

### 1. `/users/{userId}`
User profile and settings
```javascript
{
  uid: "user123",
  email: "user@example.com",
  displayName: "John Doe",
  photoURL: "https://...",
  defaultCurrency: "USD",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 2. `/users/{userId}/books/{bookId}`
Financial books (e.g., "Personal", "Business", "Family")
```javascript
{
  id: "book1",
  name: "Personal Finance",
  description: "My personal expenses",
  currency: "USD",
  icon: "💰",
  color: "#00bcd4",
  isDefault: true,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 3. `/users/{userId}/accounts/{accountId}`
Bank accounts, wallets, credit cards
```javascript
{
  id: "acc1",
  bookId: "book1", // belongs to which book
  name: "Chase Checking",
  type: "bank", // bank, cash, credit_card, digital_wallet
  balance: 5000.00,
  currency: "USD",
  icon: "🏦",
  color: "#00e676",
  isActive: true,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 4. `/users/{userId}/categories/{categoryId}`
Categories with hierarchical levels
```javascript
{
  id: "cat1",
  name: "Food & Dining",
  type: "expense", // income, expense, both
  parentId: null, // null for top-level, categoryId for subcategory
  level: 0, // 0 = parent, 1 = subcategory, 2 = sub-subcategory
  icon: "🍔",
  color: "#e91e63",
  isActive: true,
  order: 1, // for sorting
  createdAt: timestamp,
  updatedAt: timestamp
}

// Subcategory example:
{
  id: "cat2",
  name: "Restaurants",
  type: "expense",
  parentId: "cat1", // child of "Food & Dining"
  level: 1,
  icon: "🍽️",
  color: "#e91e63",
  isActive: true,
  order: 1,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 5. `/users/{userId}/tags/{tagId}`
Custom tags for transactions
```javascript
{
  id: "tag1",
  name: "Vacation",
  color: "#9c27b0",
  icon: "✈️",
  usageCount: 15, // track popularity
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 6. `/users/{userId}/transactions/{transactionId}`
Individual transactions
```javascript
{
  id: "txn1",
  bookId: "book1",
  accountId: "acc1",
  type: "expense", // income, expense, transfer
  amount: 50.00,
  currency: "USD",
  categoryId: "cat2",
  description: "Lunch at Pizza Place",
  date: timestamp, // transaction date
  tags: ["tag1", "tag2"], // array of tag IDs
  
  // Optional fields
  location: {
    name: "Pizza Place",
    address: "123 Main St",
    lat: 40.7128,
    lng: -74.0060
  },
  receipt: "https://storage.../receipt.jpg",
  notes: "Shared with friends",
  
  // For transfers
  toAccountId: null, // if type is 'transfer'
  
  // Metadata
  createdAt: timestamp,
  updatedAt: timestamp,
  createdBy: "user123"
}
```

### 7. `/users/{userId}/budgets/{budgetId}` (Optional - Future Enhancement)
Budget tracking per category/time period
```javascript
{
  id: "budget1",
  bookId: "book1",
  categoryId: "cat1",
  amount: 500.00,
  period: "monthly", // daily, weekly, monthly, yearly
  startDate: timestamp,
  endDate: timestamp,
  isActive: true,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## Query Examples

### Get all transactions for a book
```javascript
const q = query(
  collection(db, `users/${userId}/transactions`),
  where('bookId', '==', bookId),
  orderBy('date', 'desc')
);
```

### Get transactions by category (including subcategories)
```javascript
// First get category and its children
const categoryQuery = query(
  collection(db, `users/${userId}/categories`),
  where('parentId', '==', categoryId)
);
// Then query transactions with those category IDs
```

### Get transactions by tag
```javascript
const q = query(
  collection(db, `users/${userId}/transactions`),
  where('tags', 'array-contains', tagId)
);
```

### Get account balance summary
```javascript
const accounts = await getDocs(
  collection(db, `users/${userId}/accounts`)
);
```

## Indexes Required

Create these composite indexes in Firebase Console:

1. **Transactions by book and date**
   - Collection: `users/{userId}/transactions`
   - Fields: `bookId` (Ascending), `date` (Descending)

2. **Transactions by account and date**
   - Collection: `users/{userId}/transactions`
   - Fields: `accountId` (Ascending), `date` (Descending)

3. **Transactions by category and date**
   - Collection: `users/{userId}/transactions`
   - Fields: `categoryId` (Ascending), `date` (Descending)

4. **Categories by level and order**
   - Collection: `users/{userId}/categories`
   - Fields: `level` (Ascending), `order` (Ascending)

## Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /books/{bookId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      match /accounts/{accountId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      match /categories/{categoryId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      match /tags/{tagId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      match /transactions/{transactionId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      match /budgets/{budgetId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

## Migration Notes

To migrate from current structure (`/transactions`) to new structure:
1. Create user profile documents
2. Create default book for each user
3. Create default account for each user
4. Migrate transactions to `/users/{userId}/transactions` with `bookId` and `accountId`
5. Migrate categories to `/users/{userId}/categories`
6. Update all queries in the app

## Benefits of This Structure

1. **User Isolation**: All data nested under user ID for easy security rules
2. **Multi-Book Support**: Users can separate personal/business finances
3. **Account Tracking**: Track balances across multiple accounts
4. **Hierarchical Categories**: Unlimited nesting with level field
5. **Flexible Tags**: Tag any transaction with multiple labels
6. **Scalable**: Each subcollection can grow independently
7. **Query Efficient**: Proper indexes for common queries
8. **Future-Proof**: Easy to add budgets, recurring transactions, etc.
