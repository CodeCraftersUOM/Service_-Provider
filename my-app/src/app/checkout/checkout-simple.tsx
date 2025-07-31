'use client';

import React, { useState, useEffect } from 'react';
import styles from './checkout.module.css';

interface SavedCard {
  id: string;
  cardHolderName: string;
  cardNumber: string;
  expiryDate: string;
}

const CheckoutSimple = () => {
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [selectedSavedCard, setSelectedSavedCard] = useState<string>('');
  const [loadingCards, setLoadingCards] = useState(true);

  useEffect(() => {
    // Simulate loading cards
    setTimeout(() => {
      setSavedCards([]);
      setLoadingCards(false);
    }, 1000);
  }, []);

  const handleCardSelection = (cardId: string) => {
    setSelectedSavedCard(cardId);
  };

  return (
    <div className={styles.container || 'p-4'}>
      <form className={styles.form || 'max-w-md mx-auto'}>
        <div className={styles.fee || 'text-xl font-bold mb-4'}>Your fee is Rs.24000.00</div>

        {/* Saved Cards Section */}
        {loadingCards ? (
          <div className={styles.loading || 'text-center'}>Loading saved cards...</div>
        ) : savedCards.length > 0 ? (
          <>
            <div className={styles.subheading || 'text-lg font-semibold mb-2'}>Saved Cards</div>
            {savedCards.map((card) => (
              <div key={card.id} onClick={() => handleCardSelection(card.id)}>
                <input
                  type="radio"
                  value={card.id}
                  checked={selectedSavedCard === card.id}
                  readOnly
                />
                <label>
                  **** **** **** {card.cardNumber.slice(-4)} - {card.cardHolderName}
                </label>
              </div>
            ))}
          </>
        ) : (
          <div className={styles.noCards || 'text-gray-600'}>No saved cards found. Please add a new card below.</div>
        )}

        {/* Simple New Card Form */}
        <div className={styles.subheading || 'text-lg font-semibold mb-2'}>Pay with Card</div>
        
        <label className={styles.label || 'block mb-2'}>Cardholder Name</label>
        <input
          className={styles.input || 'w-full p-2 border rounded mb-4'}
          type="text"
          placeholder="John Doe"
        />

        <label className={styles.label || 'block mb-2'}>Card Number</label>
        <input
          className={styles.input || 'w-full p-2 border rounded mb-4'}
          type="text"
          placeholder="1234 5678 9012 3456"
        />

        <button 
          type="submit" 
          className={styles.submitButton || 'w-full bg-blue-500 text-white p-2 rounded'}
        >
          Pay Rs.24,000.00
        </button>
      </form>
    </div>
  );
};

export default CheckoutSimple;
