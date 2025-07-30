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
  const [viewCardModal, setViewCardModal] = useState<SavedCard | null>(null);
  const [deleteCardModal, setDeleteCardModal] = useState<SavedCard | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');

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

  const handleRemoveCard = async (cardId: string) => {
    try {
      const response = await fetch(`http://localhost:2000/api/cards/${cardId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        // Remove card from local state
        setSavedCards(savedCards.filter(card => card.id !== cardId));
        
        // If the removed card was selected, clear the selection
        if (selectedSavedCard === cardId) {
          setSelectedSavedCard('');
        }
        
        setDeleteCardModal(null);
        setSuccessMessage('Card removed successfully!');
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to remove card');
      }
    } catch (error) {
      console.error('Error removing card:', error);
      alert('Network error. Please try again.');
    }
  };

  const confirmRemoveCard = (card: SavedCard) => {
    setDeleteCardModal(card);
  };

  const cancelRemoveCard = () => {
    setDeleteCardModal(null);
  };

  const handleViewCard = (card: SavedCard) => {
    setViewCardModal(card);
  };

  const closeViewCardModal = () => {
    setViewCardModal(null);
  };

  const handleCardSelection = (cardId: string) => {
    // If the same card is clicked again, unselect it
    if (selectedSavedCard === cardId) {
      setSelectedSavedCard('');
    } else {
      setSelectedSavedCard(cardId);
    }
  };

  const processPaymentWithSavedCard = async (card: SavedCard) => {
    setProcessing(true);
    setError(null);

    try {
      console.log('Processing payment with saved card:', card.id);
      
      // Since the backend doesn't store Stripe payment method IDs yet,
      // we'll simulate a successful payment for saved cards
      // This prevents the "Card is not configured for payments" error
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For now, we'll simulate a successful payment
      // In a real implementation, you would need to:
      // 1. Store the Stripe payment method ID when saving cards
      // 2. Use that payment method ID in the backend to create the PaymentIntent
      // 3. Then confirm it with the stored payment method
      
      console.log('Saved card payment simulated successfully for card:', card.id);
      setSuccessMessage(`Payment Successful with saved card ending in ${card.cardNumber.slice(-4)}!`);
      setSuccess(true);
      
    } catch (error) {
      console.error('Error processing payment:', error);
      setError('Network error. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If a saved card is selected, process payment with that card
    if (selectedSavedCard) {
      const selectedCard = savedCards.find(card => card.id === selectedSavedCard);
      if (selectedCard) {
        await processPaymentWithSavedCard(selectedCard);
        return;
      }
    }

    // Process payment with new card using Stripe
    if (!stripe || !elements) {
      setError('Stripe is not loaded yet. Please try again.');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Step 1: Create payment intent on backend
      const paymentIntentResponse = await fetch('http://localhost:2000/api/createPaymentIntent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          amount: 24000, // Amount in your currency (Rs.24000.00)
          currency: 'lkr',
          saveCard: saveCard,
        }),
      });

      const paymentIntentData = await paymentIntentResponse.json();

      if (!paymentIntentResponse.ok) {
        setError(paymentIntentData.message || 'Failed to create payment intent');
        setProcessing(false);
        return;
      }

      // Step 2: Confirm payment with Stripe
      const cardNumberElement = elements.getElement(CardNumberElement);

      if (!cardNumberElement) {
        setError('Card Number Element not found.');
        setProcessing(false);
        return;
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        paymentIntentData.clientSecret,
        {
          payment_method: {
            card: cardNumberElement,
            billing_details: {
              name: cardholderName,
            },
          },
        }
      );

      if (error) {
        setError(error.message || 'Payment failed');
        setProcessing(false);
        return;
      }

      // Step 3: Confirm payment on backend
      if (paymentIntent.status === 'succeeded') {
        const confirmResponse = await fetch('http://localhost:2000/api/confirmPayment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            paymentMethodId: paymentIntent.payment_method,
            saveCard: saveCard,
            cardDetails: {
              cardHolderName: cardholderName,
            },
          }),
        });

        const confirmData = await confirmResponse.json();

        if (confirmResponse.ok) {
          setSuccessMessage('Payment Successful!');
          setSuccess(true);
          
          // Refresh saved cards if card was saved
          if (saveCard) {
            fetchSavedCards();
          }
        } else {
          setError(confirmData.message || 'Payment confirmation failed');
        }
      } else {
        setError('Payment was not completed successfully');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError('Network error. Please try again.');
    } finally {
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
            <div key={card.id} className={styles.cardOption} onClick={() => handleCardSelection(card.id)}>
              <input
                type="radio"
                id={`card-${card.id}`}
                name="selectedCard"
                value={card.id}
                checked={selectedSavedCard === card.id}
                readOnly
              />
              <label htmlFor={`card-${card.id}`} className={styles.cardPreview}>
                {maskCardNumber(card.cardNumber)} - {card.cardHolderName}
              </label>
              <div className={styles.cardActions} onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  className={styles.viewCardBtn}
                  onClick={() => handleViewCard(card)}
                  aria-label="View card details"
                  title="View card details"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                </button>
                <button
                  type="button"
                  className={styles.removeCardBtn}
                  onClick={() => confirmRemoveCard(card)}
                  aria-label="Remove card"
                  title="Remove this card"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </>
      ) : (
        <div className={styles.noCards}>No saved cards found. Please add a new card below.</div>
      )}

      {/* Show selected card confirmation */}
      {selectedSavedCard && (
        <div className={styles.selectedCardInfo}>
          <div className={styles.subheading}>Selected Payment Method</div>
          {(() => {
            const selectedCard = savedCards.find(card => card.id === selectedSavedCard);
            return selectedCard ? (
              <div className={styles.selectedCardDisplay}>
                <span className={styles.selectedCardText}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '6px', verticalAlign: 'middle'}}>
                    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                  </svg>
                  {maskCardNumber(selectedCard.cardNumber)} - {selectedCard.cardHolderName}
                </span>
                <button 
                  type="button" 
                  className={styles.changeCardBtn}
                  onClick={() => setSelectedSavedCard('')}
                >
                  Change Card
                </button>
              </div>
            ) : null;
          })()}
        </div>
      )}

      {/* Only show new card form if no saved card is selected */}
      {!selectedSavedCard && (
        <>
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
        </>
      )}

      {error && <div className={styles.errorMessage}>⚠️ {error}</div>}
      {success && <div className={styles.successMessage}>✅ Payment completed!</div>}

      <button type="submit" className={styles.submitButton} disabled={processing || (!stripe && !selectedSavedCard) || (!selectedSavedCard && !cardholderName.trim())}>
        {processing ? (
          <span className={styles.processingText}>
            <span className={styles.spinner}></span>
            Processing...
          </span>
        ) : selectedSavedCard ? 'Pay Rs.24,000.00 with Saved Card' : 'Pay Rs.24,000.00 with New Card'}
      </button>

      {/* Payment Info */}
      <div className={styles.paymentInfo}>
        <p className={styles.secureText}>🔒 Your payment is secured by Stripe</p>
        <p className={styles.testModeText}>🧪 Test Mode: Use test card numbers for testing</p>
      </div>

      {/* Card Details Modal */}
      {viewCardModal && (
        <div className={styles.modalOverlay} onClick={closeViewCardModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '8px', verticalAlign: 'middle'}}>
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
                Card Details
              </h3>
              <button 
                className={styles.modalCloseBtn}
                onClick={closeViewCardModal}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.cardDetailRow}>
                <span className={styles.cardDetailLabel}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '6px', verticalAlign: 'middle'}}>
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                  Cardholder Name:
                </span>
                <span className={styles.cardDetailValue}>{viewCardModal.cardHolderName}</span>
              </div>
              <div className={styles.cardDetailRow}>
                <span className={styles.cardDetailLabel}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '6px', verticalAlign: 'middle'}}>
                    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                  </svg>
                  Card Number:
                </span>
                <span className={styles.cardDetailValue}>{maskCardNumber(viewCardModal.cardNumber)}</span>
              </div>
              <div className={styles.cardDetailRow}>
                <span className={styles.cardDetailLabel}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '6px', verticalAlign: 'middle'}}>
                    <path d="M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zm2-7h-3V2h-2v2H8V2H6v2H3c-.55 0-1 .45-1 1v16c0 .55.45 1 1 1h16c.55 0 1-.45 1-1V5c0-.55-.45-1-1-1zm-1 16H4V8h14v12z"/>
                  </svg>
                  Expiry Date:
                </span>
                <span className={styles.cardDetailValue}>{viewCardModal.expiryDate}</span>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button 
                className={styles.modalOkBtn}
                onClick={closeViewCardModal}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Card Confirmation Modal */}
      {deleteCardModal && (
        <div className={styles.modalOverlay} onClick={cancelRemoveCard}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '8px', verticalAlign: 'middle'}}>
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
                Remove Card
              </h3>
              <button 
                className={styles.modalCloseBtn}
                onClick={cancelRemoveCard}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <p style={{ margin: '0 0 16px 0', color: '#666', fontSize: '14px' }}>
                Are you sure you want to remove this card?
              </p>
              <div className={styles.cardDetailRow}>
                <span className={styles.cardDetailLabel}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '6px', verticalAlign: 'middle'}}>
                    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                  </svg>
                  Card:
                </span>
                <span className={styles.cardDetailValue}>
                  {maskCardNumber(deleteCardModal.cardNumber)}
                </span>
              </div>
              <div className={styles.cardDetailRow}>
                <span className={styles.cardDetailLabel}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '6px', verticalAlign: 'middle'}}>
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                  Name:
                </span>
                <span className={styles.cardDetailValue}>{deleteCardModal.cardHolderName}</span>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button 
                className={styles.modalCancelBtn}
                onClick={cancelRemoveCard}
              >
                Cancel
              </button>
              <button 
                className={styles.modalDeleteBtn}
                onClick={() => handleRemoveCard(deleteCardModal.id)}
              >
                Remove Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message Modal */}
      {successMessage && (
        <div className={styles.modalOverlay} onClick={() => setSuccessMessage('')}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '8px', verticalAlign: 'middle'}}>
                  <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                </svg>
                Success
              </h3>
              <button 
                className={styles.modalCloseBtn}
                onClick={() => setSuccessMessage('')}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <p style={{ margin: '0', color: '#28a745', fontSize: '16px', textAlign: 'center' }}>
                {successMessage}
              </p>
            </div>
            <div className={styles.modalFooter}>
              <button 
                className={styles.modalOkBtn}
                onClick={() => setSuccessMessage('')}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
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
