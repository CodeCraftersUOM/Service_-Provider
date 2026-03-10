# Fix for "Card is not configured for payments" Error

## 🚨 Problem
When you save a card during payment, the payment method is created but not properly attached to a Stripe customer for future use. This causes the "Card is not configured for payments" error when trying to reuse the saved card.

## 🔧 Backend Fix Required

### 1. Update Your User Model
Add a Stripe customer ID field to your user model:

```javascript
// In your user model
const userSchema = new mongoose.Schema({
  // ... existing fields
  stripeCustomerId: { type: String }, // Add this field
  // ... other fields
});
```

### 2. Update confirmPayment Function

Replace your current `confirmPayment` function with this corrected version:

```javascript
const confirmPayment = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { paymentIntentId, paymentMethodId, saveCard, cardDetails } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment Intent ID is required'
      });
    }

    // Retrieve the payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      let savedCardInfo = null;

      // Save card if requested and payment method ID provided
      if (saveCard && paymentMethodId && cardDetails) {
        try {
          // Get or create Stripe customer
          let stripeCustomerId = req.user.stripeCustomerId;
          
          if (!stripeCustomerId) {
            // Create new customer
            const customer = await stripe.customers.create({
              email: req.user.email,
              name: req.user.fullName || cardDetails.cardHolderName,
              metadata: {
                userId: req.user._id.toString()
              }
            });
            
            stripeCustomerId = customer.id;
            
            // Save customer ID to user
            await User.findByIdAndUpdate(req.user._id, {
              stripeCustomerId: stripeCustomerId
            });
          }

          // Attach payment method to customer
          await stripe.paymentMethods.attach(paymentMethodId, {
            customer: stripeCustomerId,
          });

          // Get payment method details
          const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
          
          if (paymentMethod.card) {
            // Save card details to database
            const cardData = {
              userId: req.user._id,
              cardHolderName: cardDetails.cardHolderName || 'Card Holder',
              cardNumber: `****-****-****-${paymentMethod.card.last4}`,
              expiryDate: `${String(paymentMethod.card.exp_month).padStart(2, '0')}/${String(paymentMethod.card.exp_year).slice(-2)}`,
              cvv: '***',
              stripePaymentMethodId: paymentMethodId, // Important: Store this!
              stripeCustomerId: stripeCustomerId, // Also store customer ID
              isActive: true
            };

            const newCard = new CardDetail(cardData);
            savedCardInfo = await newCard.save();
          }
        } catch (cardSaveError) {
          console.error('Error saving card after payment:', cardSaveError);
          // Don't fail the payment if card saving fails
        }
      }

      res.status(200).json({
        success: true,
        message: 'Payment confirmed successfully',
        paymentIntent: {
          id: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency
        },
        savedCard: savedCardInfo ? {
          id: savedCardInfo._id,
          cardHolderName: savedCardInfo.cardHolderName,
          cardNumber: savedCardInfo.cardNumber,
          expiryDate: savedCardInfo.expiryDate
        } : null
      });

    } else {
      res.status(400).json({
        success: false,
        message: 'Payment not successful',
        status: paymentIntent.status
      });
    }

  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm payment',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};
```

### 3. Update processPaymentWithSavedCard Function

Replace your current function with this corrected version:

```javascript
const processPaymentWithSavedCard = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { cardId, amount, currency = 'lkr' } = req.body;

    if (!cardId || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Card ID and valid amount are required'
      });
    }

    // Find the saved card
    const savedCard = await CardDetail.findOne({
      _id: cardId,
      userId: req.user._id,
      isActive: true
    });

    if (!savedCard) {
      return res.status(404).json({
        success: false,
        message: 'Saved card not found'
      });
    }

    if (!savedCard.stripePaymentMethodId) {
      return res.status(400).json({
        success: false,
        message: 'Card is not configured for payments. Please re-save the card.'
      });
    }

    // Verify the payment method is still valid and attached to customer
    try {
      const paymentMethod = await stripe.paymentMethods.retrieve(savedCard.stripePaymentMethodId);
      
      if (!paymentMethod.customer) {
        // Payment method is not attached to customer, re-attach it
        if (req.user.stripeCustomerId) {
          await stripe.paymentMethods.attach(savedCard.stripePaymentMethodId, {
            customer: req.user.stripeCustomerId,
          });
        } else {
          return res.status(400).json({
            success: false,
            message: 'Card is not configured for payments. Please re-save the card.'
          });
        }
      }
    } catch (pmError) {
      return res.status(400).json({
        success: false,
        message: 'Card is no longer valid. Please re-save the card.'
      });
    }

    // Create payment intent with the saved payment method
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency.toLowerCase(),
      payment_method: savedCard.stripePaymentMethodId,
      customer: req.user.stripeCustomerId,
      confirmation_method: 'manual',
      confirm: true,
      metadata: {
        userId: req.user._id.toString(),
        userEmail: req.user.email,
        cardId: cardId,
        savedCardUsed: 'true'
      }
    });

    // Handle different payment statuses
    if (paymentIntent.status === 'requires_action' || paymentIntent.status === 'requires_source_action') {
      return res.json({
        success: true,
        requiresAction: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    }

    if (paymentIntent.status === 'succeeded') {
      return res.json({
        success: true,
        message: 'Payment successful',
        paymentIntent: {
          id: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency
        },
        cardInfo: {
          id: savedCard._id,
          cardHolderName: savedCard.cardHolderName,
          cardNumber: savedCard.cardNumber,
          expiryDate: savedCard.expiryDate
        }
      });
    }

    return res.status(400).json({
      success: false,
      message: 'Payment failed',
      status: paymentIntent.status
    });

  } catch (error) {
    console.error('Error processing payment with saved card:', error);
    
    if (error.message && error.message.includes('not configured for payments')) {
      return res.status(400).json({
        success: false,
        message: 'Card is not configured for payments. Please re-save the card.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to process payment',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};
```

### 4. Update Card Model Schema

Make sure your card model includes the new fields:

```javascript
const cardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cardHolderName: { type: String, required: true },
  cardNumber: { type: String, required: true }, // Masked version
  expiryDate: { type: String, required: true },
  cvv: { type: String, default: '***' },
  stripePaymentMethodId: { type: String, required: true }, // Add this
  stripeCustomerId: { type: String }, // Add this
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

## 🔄 Migration Steps

1. **Add stripeCustomerId field to User model**
2. **Add stripeCustomerId field to Card model**
3. **Update the backend functions as shown above**
4. **Clear existing saved cards** (they won't work with old structure)
5. **Test by saving a new card and using it**

## 🧪 Testing

After implementing these changes:

1. **Clear existing saved cards** from your database (they don't have proper payment method attachment)
2. **Add a new card** with "Save card" checked
3. **Verify the payment method is properly attached** to a customer
4. **Use the saved card** for a new payment
5. **Confirm it works without the error**

## ⚠️ Important Notes

- **Existing saved cards will not work** until you implement these changes
- **Payment methods must be attached to customers** for reuse
- **Always verify payment method validity** before using saved cards
- **Handle errors gracefully** with clear user messages
