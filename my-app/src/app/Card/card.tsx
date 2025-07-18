'use client';

import React, { useState } from 'react';
import styles from './card.module.css';
import { loadStripe } from '@stripe/stripe-js';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

// Replace with your own publishable key
const stripePromise = loadStripe('pk_test_51RlV0ULm4wWgyhyBvv0KqRNtKgvbBZVv1Z0uwHhygxjbiXmRuEWic2jFgR8TgcyoeGmWVsZWwWlSxYPEXPflA9o300udbmpj4W');

const CARD_STYLE = {
  style: {
    base: {
      fontSize: '16px',
      color: '#32325d',
      '::placeholder': {
        color: '#555',
      },
    },
    invalid: {
      color: '#fa755a',
    },
  },
};

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [cardholderName, setCardholderName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    const cardNumberElement = elements.getElement(CardNumberElement);

    if (!cardNumberElement) {
      setError('Card Number Element not found.');
      setProcessing(false);
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardNumberElement,
      billing_details: {
        name: cardholderName,
      },
    });

    if (error) {
      setError(error.message || 'An error occurred');
      setProcessing(false);
    } else {
      setSuccess(true);
      console.log('PaymentMethod ID:', paymentMethod?.id);
      alert('Card details saved successfully!');
      setProcessing(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Enter Card Details</h2>

      <label className={styles.label}>Cardholder Name</label>
      <input
        className={styles.input}
        type="text"
        value={cardholderName}
        onChange={(e) => setCardholderName(e.target.value)}
        required
        placeholder="Chamathka Silva"
      />

      <label className={styles.label}>Card Number</label>
      <div className={styles.input}>
        <CardNumberElement options={CARD_STYLE} />
      </div>

      <div className={styles.row}>
        <div className={styles.rowColumn}>
          <label className={styles.label}>Expiry Date</label>
          <div className={styles.input}>
            <CardExpiryElement options={CARD_STYLE} />
          </div>
        </div>

        <div className={styles.rowColumn}>
          <label className={styles.label}>CVV</label>
          <div className={styles.input}>
            <CardCvcElement options={CARD_STYLE} />
          </div>
        </div>
      </div>

      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>Card added successfully!</div>}

      <button type="submit" className={styles.submitButton} disabled={processing || !stripe}>
        {processing ? 'Processing...' : 'Submit'}
      </button>
    </form>
  );
};

const Card = () => {
  return (
    <div className={styles.container}>
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
};

export default Card;
