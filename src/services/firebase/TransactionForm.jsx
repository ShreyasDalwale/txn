import React, { useState, useEffect } from 'react';
import { addTxn, db, findTxn, getCities } from './firebase'; // Import your Firestore service
import './m.scss'
import { MultiSelect } from '@mantine/core';

const TransactionForm = () => {
  const [amount, setAmount] = useState('');
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
    <div className='TransactionForm'>


      <form onSubmit={handleSubmit}>
        {/* <label>
          <input
            // type="number"
            placeholder='Amount'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label> */}
        <div className='ti2'>
          <div class="field">
            <input
              type="number"
              placeholder="Amount"
              value={category}
              autofocus
              onChange={(e) => setCategory(e.target.value)}
            />
            <div class="line"></div>
          </div>
        </div>
        {/* <label>
          <input
            type="number"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </label> */}
        <label>
          {amount} | {category}
        </label>
        <button type="submit">Save</button>
        <MultiSelect
          label="Your favorite libraries"
          placeholder="Pick value"
          data={['React', 'Angular', 'Vue', 'Svelte']}
        />
      </form>
    </div>
  );
};

export default TransactionForm;
