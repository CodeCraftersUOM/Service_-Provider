'use client';

import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import styles from './card.module.css';

const CardDetails = () => {
  const [formData, setFormData] = useState({
    cardHolderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:2000/api/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          cardHolderName: formData.cardHolderName,
          cardNumber: formData.cardNumber,
          expiryDate: formData.expiryDate,
          cvv: formData.cvv
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Card details saved successfully!');
        setFormData({
          cardHolderName: '',
          cardNumber: '',
          expiryDate: '',
          cvv: ''
        });
        // Optionally redirect to checkout or dashboard
        setTimeout(() => {
          router.push('/checkout');
        }, 2000);
      } else {
        setError(data.message || 'Failed to save card details');
      }
    } catch (err) {
      console.error('Error saving card:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
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

          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}

          <label htmlFor="cardHolderName">Card holder name</label>
          <input 
            className={styles.input} 
            type="text" 
            id="cardHolderName" 
            name="cardHolderName"
            value={formData.cardHolderName}
            onChange={handleInputChange}
            placeholder="Enter Card holder name" 
            required
          />

          <label htmlFor="cardNumber">Card Number</label>
          <input 
            className={styles.input} 
            type="text" 
            id="cardNumber" 
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleInputChange}
            placeholder="Enter card Number" 
            maxLength={16}
            required
          />

          <label htmlFor="expiryDate">Expiry Date (MM/YY)</label>
          <input 
            className={styles.input} 
            type="text" 
            id="expiryDate" 
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleInputChange}
            placeholder="MM/YY" 
            maxLength={5}
            required
          />

          <label htmlFor="cvv">CVV</label>
          <input 
            className={styles.input} 
            type="text" 
            id="cvv" 
            name="cvv"
            value={formData.cvv}
            onChange={handleInputChange}
            placeholder="Enter your CVV" 
            maxLength={4}
            required
          />

          <button 
            className={styles.submitButton} 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Submit'}
          </button>
        </form>
      </div>
    </>
  );
};

export default CardDetails;
