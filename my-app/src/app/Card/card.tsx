'use client';

import React, { useState } from 'react';
import Head from 'next/head';
import styles from './card.module.css';

const OtherServices = () => {
  const [formData, setFormData] = useState({
    cardHolderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch('http://localhost:2000/api/addCard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage('✅ Successfully added your card details!');
        setFormData({ cardHolderName: '', cardNumber: '', expiryDate: '', cvv: '' });
      } else {
        const error = await res.json();
        setMessage(`❌ Error: ${error.error || 'Something went wrong'}`);
      }
    } catch (error) {
      console.error(error);
      setMessage('❌ Server error. Please try again.');
    }
  };

  return (
    <>
      <Head>
        <title>Card Details</title>
      </Head>
      <div className={styles.container}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h1 className={styles.title}>Add your Card Details</h1>

          <label htmlFor="cardHolderName">Card holder name</label>
          <input
            className={styles.input}
            type="text"
            id="cardHolderName"
            name="cardHolderName"
            placeholder="Enter Card holder name"
            value={formData.cardHolderName}
            onChange={handleChange}
            required
          />

          <label htmlFor="cardNumber">Card Number</label>
          <input
            className={styles.input}
            type="text"
            id="cardNumber"
            name="cardNumber"
            placeholder="Enter card number"
            value={formData.cardNumber}
            onChange={handleChange}
            required
          />

          <label htmlFor="expiryDate">Expiry Date</label>
          <input
            className={styles.input}
            type="text"
            id="expiryDate"
            name="expiryDate"
            placeholder="Enter expiry date"
            value={formData.expiryDate}
            onChange={handleChange}
            required
          />

          <label htmlFor="cvv">CVV</label>
          <input
            className={styles.input}
            type="text"
            id="cvv"
            name="cvv"
            placeholder="Enter your CVV"
            value={formData.cvv}
            onChange={handleChange}
            required
          />

          <button className={styles.submitButton} type="submit">Submit</button>

          {message && <p style={{ marginTop: '10px', color: message.startsWith('✅') ? 'green' : 'red' }}>{message}</p>}
        </form>
      </div>
    </>
  );
};

export default OtherServices;
