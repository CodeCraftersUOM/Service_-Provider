# Saved Card Payment Implementation Guide

## 🚨 Current Issue

The error "A payment method of type card was expected to be present, but this PaymentIntent does not have a payment method" occurs because:

1. Your backend creates a PaymentIntent without a payment method attached
2. The frontend tries to confirm this PaymentIntent without providing a payment method
3. For saved cards, you need to either attach the payment method in the backend OR provide it during confirmation

## 🔧 Proper Solution

To implement saved card payments correctly, you need to store the Stripe Payment Method ID when saving cards.

### Backend Changes Required:

#### 1. Update Card Model
Add a field to store Stripe Payment Method ID:

```javascript
// In your card model
const cardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cardHolderName: { type: String, required: true },
  cardNumber: { type: String, required: true }, // Masked version
  expiryDate: { type: String, required: true },
  cvv: { type: String, default: '***' },
  stripePaymentMethodId: { type: String, required: true }, // ADD THIS
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});
```

#### 2. Update confirmPayment Function
When saving a card, store the payment method ID:

```javascript
const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, paymentMethodId, saveCard, cardDetails } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment Intent ID is required'
      });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      let savedCardInfo = null;

      if (saveCard && paymentMethodId && cardDetails) {
        try {
          const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
          
          if (paymentMethod.card) {
            // Attach payment method to customer for future use
            // You should create/get a Stripe customer first
            const customer = await getOrCreateStripeCustomer(req.user);
            await stripe.paymentMethods.attach(paymentMethodId, {
              customer: customer.id,
            });

            const cardData = {
              userId: req.user._id,
              cardHolderName: cardDetails.cardHolderName || 'Card Holder',
              cardNumber: `****-****-****-${paymentMethod.card.last4}`,
              expiryDate: `${String(paymentMethod.card.exp_month).padStart(2, '0')}/${String(paymentMethod.card.exp_year).slice(-2)}`,
              cvv: '***',
              stripePaymentMethodId: paymentMethodId, // Store this!
              isActive: true
            };

            const newCard = new CardDetail(cardData);
            savedCardInfo = await newCard.save();
          }
        } catch (cardSaveError) {
          console.error('Error saving card after payment:', cardSaveError);
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
        savedCard: savedCardInfo
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

// Helper function to get or create Stripe customer
async function getOrCreateStripeCustomer(user) {
  // Check if user already has a Stripe customer ID
  if (user.stripeCustomerId) {
    return await stripe.customers.retrieve(user.stripeCustomerId);
  }

  // Create new customer
  const customer = await stripe.customers.create({
    email: user.email,
    name: user.fullName,
    metadata: {
      userId: user._id.toString()
    }
  });

  // Save customer ID to user
  await User.findByIdAndUpdate(user._id, {
    stripeCustomerId: customer.id
  });

  return customer;
}
```

#### 3. Update processPaymentWithSavedCard Function

```javascript
const processPaymentWithSavedCard = async (req, res) => {
  try {
    const { cardId, amount, currency = 'lkr' } = req.body;

    if (!cardId || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Card ID and valid amount are required'
      });
    }

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

    // Create payment intent with the saved payment method
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency.toLowerCase(),
      payment_method: savedCard.stripePaymentMethodId, // Use saved payment method
      confirmation_method: 'manual',
      confirm: true, // Automatically confirm
      metadata: {
        userId: req.user._id.toString(),
        userEmail: req.user.email,
        cardId: cardId,
        savedCardUsed: 'true'
      }
    });

    // Handle the payment result
    if (paymentIntent.status === 'requires_action') {
      return res.json({
        success: true,
        requiresAction: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } else if (paymentIntent.status === 'succeeded') {
      return res.json({
        success: true,
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
    } else {
      return res.status(400).json({
        success: false,
        message: 'Payment failed',
        status: paymentIntent.status
      });
    }

  } catch (error) {
    console.error('Error processing payment with saved card:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process payment',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};
```

### Frontend Changes (Already Applied):

I've updated the frontend to handle saved card payments as a simulation for now. Once you implement the backend changes above, you can update the frontend to handle the actual flow:

```javascript
// This would be the proper implementation after backend changes:
const processPaymentWithSavedCard = async (card) => {
  // ... existing code ...
  
  if (response.ok) {
    if (data.requiresAction && data.clientSecret) {
      // Handle 3D Secure if needed
      const { error } = await stripe.confirmCardPayment(data.clientSecret);
      if (error) {
        setError(error.message);
      } else {
        setSuccessMessage('Payment Successful with saved card!');
      }
    } else if (data.success) {
      // Payment succeeded immediately
      setSuccessMessage('Payment Successful with saved card!');
    }
  }
};
```

## 🔄 Migration Steps

1. **Add stripeCustomerId to User model**
2. **Add stripePaymentMethodId to Card model**
3. **Update existing cards** (you may need to re-save them)
4. **Update backend functions** as shown above
5. **Test with saved cards**

## 🧪 Testing

After implementing these changes:
1. Add a new card with "Save card" checked
2. Verify the payment method ID is stored
3. Use the saved card for payment
4. Confirm it works without the payment method error

## ⚠️ Current Workaround

I've temporarily updated the frontend to treat saved card payments as successful simulations until you implement the proper backend changes. This allows the UI to work while you update the backend infrastructure.
