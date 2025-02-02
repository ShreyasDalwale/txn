import React, { useState, useEffect } from 'react';
import { addTxn, db, findTxn, getCities } from './firebase'; // Import your Firestore service

const TransactionForm = () => {
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let r = await addTxn({
        // .parse(amount),
        amount,
        category,
        // Add any other transaction details here
      });
      console.log(r);
      console.log(await findTxn(r.id));

      setAmount(0);
      setCategory('');
      alert('Transaction saved successfully!');
    } catch (error) {
      console.log('Error saving transaction:', error);
    }
  };

  useEffect(() => {
    // getCities();
    // findTxn(1);
  }, []);
  return (
    <form onSubmit={handleSubmit}>
      <label>
        Amount:
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </label>
      <label>
        Category:
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </label>
      <button type="submit">Save Transaction</button>
    </form>
  );
};

export default TransactionForm;
