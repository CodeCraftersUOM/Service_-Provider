# Stripe Payment Integration Backend Setup

## Environment Configuration

Add these environment variables to your backend (Node.js/Express):

```env
STRIPE_PUBLISHABLE_KEY=pk_test_51RlV0ULm4wWgyhyBvv0KqRNtKgvbBZVv1Z0uwHhygxjbiXmRuEWic2jFgR8TgcyoeGmWVsZWwWlSxYPEXPflA9o300udbmpj4W
STRIPE_SECRET_KEY=sk_test_51RlV0ULm4wWgyhyB4yaTQgFCrMFmkcQABSGcBVixxJMigWcmxiAhlkD2PjzPYv4qnz1dNap01BwC2E6WWUqt2hC200yChfPYYI
```

## Required Dependencies

Install Stripe for your backend:

```bash
npm install stripe
```

## Backend API Endpoints Implementation

### 1. Initialize Stripe

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
```

### 2. Process Payment Endpoint

```javascript
app.post('/api/process-payment', async (req, res) => {
  try {
    const { paymentMethodId, amount, currency = 'lkr', saveCard, cardHolderName } = req.body;
    const userId = req.user.id; // Get from your auth middleware

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents
      currency: currency,
      payment_method: paymentMethodId,
      confirmation_method: 'manual',
      confirm: true,
      return_url: 'http://localhost:3000/checkout', // Your frontend URL
      metadata: {
        userId: userId.toString(),
        saveCard: saveCard.toString()
      }
    });

    // If payment requires additional action (3D Secure)
    if (paymentIntent.status === 'requires_action' || paymentIntent.status === 'requires_source_action') {
      return res.json({
        requiresAction: true,
        clientSecret: paymentIntent.client_secret
      });
    }

    // Payment succeeded
    if (paymentIntent.status === 'succeeded') {
      // Save card if requested
      if (saveCard) {
        try {
          // Get payment method details
          const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
          
          // Save to your database
          await saveCardToDatabase({
            userId: userId,
            stripePaymentMethodId: paymentMethodId,
            cardHolderName: cardHolderName,
            cardNumber: `****${paymentMethod.card.last4}`,
            expiryDate: `${paymentMethod.card.exp_month}/${paymentMethod.card.exp_year}`,
            cardBrand: paymentMethod.card.brand
          });
        } catch (saveError) {
          console.error('Error saving card:', saveError);
        }
      }

      return res.json({
        success: true,
        paymentIntent: paymentIntent
      });
    }

    // Payment failed
    return res.status(400).json({
      error: 'Payment failed',
      message: 'Payment was not successful'
    });

  } catch (error) {
    console.error('Payment processing error:', error);
    return res.status(500).json({
      error: 'Payment failed',
      message: error.message
    });
  }
});
```

### 3. Process Saved Card Payment Endpoint

```javascript
app.post('/api/process-saved-card-payment', async (req, res) => {
  try {
    const { cardId, amount } = req.body;
    const userId = req.user.id;

    // Get saved card from database
    const savedCard = await getSavedCardFromDatabase(cardId, userId);
    if (!savedCard) {
      return res.status(404).json({
        error: 'Card not found',
        message: 'The selected card was not found'
      });
    }

    // Create payment intent with saved payment method
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'lkr',
      payment_method: savedCard.stripePaymentMethodId,
      confirmation_method: 'manual',
      confirm: true,
      return_url: 'http://localhost:3000/checkout',
      metadata: {
        userId: userId.toString(),
        savedCardId: cardId
      }
    });

    // Handle different payment statuses
    if (paymentIntent.status === 'requires_action' || paymentIntent.status === 'requires_source_action') {
      return res.json({
        requiresAction: true,
        clientSecret: paymentIntent.client_secret
      });
    }

    if (paymentIntent.status === 'succeeded') {
      return res.json({
        success: true,
        paymentIntent: paymentIntent
      });
    }

    return res.status(400).json({
      error: 'Payment failed',
      message: 'Payment was not successful'
    });

  } catch (error) {
    console.error('Saved card payment error:', error);
    return res.status(500).json({
      error: 'Payment failed',
      message: error.message
    });
  }
});
```

### 4. Database Helper Functions

```javascript
// Save card to database
async function saveCardToDatabase(cardData) {
  // Implement based on your database (MongoDB, MySQL, etc.)
  // Example for SQL:
  const query = `
    INSERT INTO cards (user_id, stripe_payment_method_id, card_holder_name, card_number, expiry_date, card_brand, created_at)
    VALUES (?, ?, ?, ?, ?, ?, NOW())
  `;
  
  return await db.execute(query, [
    cardData.userId,
    cardData.stripePaymentMethodId,
    cardData.cardHolderName,
    cardData.cardNumber,
    cardData.expiryDate,
    cardData.cardBrand
  ]);
}

// Get saved card from database
async function getSavedCardFromDatabase(cardId, userId) {
  // Implement based on your database
  const query = `
    SELECT id, stripe_payment_method_id, card_holder_name, card_number, expiry_date, card_brand
    FROM cards 
    WHERE id = ? AND user_id = ?
  `;
  
  const [rows] = await db.execute(query, [cardId, userId]);
  return rows[0] || null;
}
```

### 5. Get Saved Cards Endpoint (Update existing)

```javascript
app.get('/api/cards', async (req, res) => {
  try {
    const userId = req.user.id;
    
    const query = `
      SELECT id, card_holder_name, card_number, expiry_date, card_brand, created_at
      FROM cards 
      WHERE user_id = ?
      ORDER BY created_at DESC
    `;
    
    const [cards] = await db.execute(query, [userId]);
    
    res.json({
      success: true,
      cards: cards
    });
    
  } catch (error) {
    console.error('Error fetching cards:', error);
    res.status(500).json({
      error: 'Failed to fetch cards',
      message: error.message
    });
  }
});
```

### 6. Delete Card Endpoint (Update existing)

```javascript
app.delete('/api/cards/:cardId', async (req, res) => {
  try {
    const { cardId } = req.params;
    const userId = req.user.id;
    
    // Get card details first
    const savedCard = await getSavedCardFromDatabase(cardId, userId);
    if (!savedCard) {
      return res.status(404).json({
        error: 'Card not found',
        message: 'The card was not found'
      });
    }
    
    // Detach payment method from Stripe
    try {
      await stripe.paymentMethods.detach(savedCard.stripe_payment_method_id);
    } catch (stripeError) {
      console.error('Error detaching payment method from Stripe:', stripeError);
      // Continue with database deletion even if Stripe detach fails
    }
    
    // Delete from database
    const deleteQuery = `DELETE FROM cards WHERE id = ? AND user_id = ?`;
    await db.execute(deleteQuery, [cardId, userId]);
    
    res.json({
      success: true,
      message: 'Card removed successfully'
    });
    
  } catch (error) {
    console.error('Error deleting card:', error);
    res.status(500).json({
      error: 'Failed to delete card',
      message: error.message
    });
  }
});
```

## Database Schema

Create this table for storing saved cards:

```sql
CREATE TABLE cards (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  stripe_payment_method_id VARCHAR(255) NOT NULL,
  card_holder_name VARCHAR(255) NOT NULL,
  card_number VARCHAR(20) NOT NULL, -- Masked version like ****1234
  expiry_date VARCHAR(7) NOT NULL, -- MM/YYYY format
  card_brand VARCHAR(50) NOT NULL, -- visa, mastercard, etc.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
);
```

## Testing with Stripe Test Cards

Use these test card numbers for testing:

### Successful Payments:
- **Visa**: 4242424242424242
- **Visa (debit)**: 4000056655665556
- **Mastercard**: 5555555555554444
- **American Express**: 378282246310005

### 3D Secure Authentication:
- **Requires authentication**: 4000002500003155
- **Authentication fails**: 4000008400001629

### Declined Cards:
- **Generic decline**: 4000000000000002
- **Insufficient funds**: 4000000000009995
- **Lost card**: 4000000000009987

**Note**: Use any future expiry date and any 3-4 digit CVC for test cards.

## Error Handling

The frontend is already set up to handle:
- Payment success
- 3D Secure authentication
- Payment failures
- Network errors
- Card validation errors

Make sure your backend returns appropriate error messages that match the frontend expectations.
