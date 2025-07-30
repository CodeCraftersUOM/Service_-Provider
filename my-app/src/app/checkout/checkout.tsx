'use client';

import React, { useState, useEffect } from 'react';
import styles from './checkout.module.css';
import { loadStripe } from '@stripe/stripe-js';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51RlV0ULm4wWgyhyBvv0KqRNtKgvbBZVv1Z0uwHhygxjbiXmRuEWic2jFgR8TgcyoeGmWVsZWwWlSxYPEXPflA9o300udbmpj4W');

interface SavedCard {
  id: string;
  cardHolderName: string;
  cardNumber: string;
  expiryDate: string;
}

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
  const [saveCard, setSaveCard] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [selectedSavedCard, setSelectedSavedCard] = useState<string>('');
  const [loadingCards, setLoadingCards] = useState(true);

  // Fetch saved cards on component mount
  useEffect(() => {
    fetchSavedCards();
  }, []);

  const fetchSavedCards = async () => {
    try {
      const response = await fetch('http://localhost:2000/api/cards', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setSavedCards(data.cards || []);
      } else {
        console.error('Failed to fetch saved cards');
      }
    } catch (error) {
      console.error('Error fetching saved cards:', error);
    } finally {
      setLoadingCards(false);
    }
  };

  const maskCardNumber = (cardNumber: string) => {
    return `**** **** **** ${cardNumber.slice(-4)}`;
  };

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
      console.log('PaymentMethod ID:', paymentMethod?.id);
      alert('Payment Successful!');
      setSuccess(true);
      setProcessing(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.fee}>Your fee is Rs.24000.00</div>

      {/* Saved Cards Section */}
      {loadingCards ? (
        <div className={styles.loading}>Loading saved cards...</div>
      ) : savedCards.length > 0 ? (
        <>
          <div className={styles.subheading}>Saved Cards</div>
          {savedCards.map((card) => (
            <div key={card.id} className={styles.cardOption}>
              <input
                type="radio"
                id={`card-${card.id}`}
                name="selectedCard"
                value={card.id}
                checked={selectedSavedCard === card.id}
                onChange={(e) => setSelectedSavedCard(e.target.value)}
              />
              <label htmlFor={`card-${card.id}`} className={styles.cardPreview}>
                {maskCardNumber(card.cardNumber)} - {card.cardHolderName}
              </label>
            </div>
          ))}
        </>
      ) : (
        <div className={styles.noCards}>No saved cards found. Please add a new card below.</div>
      )}

      <div className={styles.subheading}>Pay with Another Card</div>
      <p className={styles.label}>Card Details</p>

      <label className={styles.label}>Cardholder Name</label>
      <input
        className={styles.input}
        type="text"
        value={cardholderName}
        onChange={(e) => setCardholderName(e.target.value)}
        required
        placeholder="Abcd Efgh"
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
          <label className={styles.label}>CVC</label>
          <div className={styles.input}>
            <CardCvcElement options={CARD_STYLE} />
          </div>
        </div>
      </div>

      <div className={styles.checkbox}>
        <input
          type="checkbox"
          checked={saveCard}
          onChange={() => setSaveCard(!saveCard)}
        />
        <label>Save card for future payments</label>
      </div>

      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>Payment completed!</div>}

      <button type="submit" className={styles.submitButton} disabled={processing || !stripe}>
        {processing ? 'Processing...' : 'Pay'}
      </button>
    </form>
  );
};

const Checkout = () => {
  return (
    <div className={styles.container}>
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
};

export default Checkout;
