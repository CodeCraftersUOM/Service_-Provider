# Card API Endpoints

## Backend Implementation Required

You need to implement these API endpoints in your backend server (running on localhost:2000):

### 1. Save Card Details
**POST** `/api/cards`

**Headers:**
- Content-Type: application/json
- Include cookies for authentication

**Request Body:**
```json
{
  "cardHolderName": "John Doe",
  "cardNumber": "1234567890123456", 
  "expiryDate": "12/25",
  "cvv": "123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Card saved successfully",
  "cardId": "unique-card-id"
}
```

### 2. Get User's Saved Cards
**GET** `/api/cards`

**Headers:**
- Include cookies for authentication

**Response:**
```json
{
  "success": true,
  "cards": [
    {
      "id": "card-id-1",
      "cardHolderName": "John Doe",
      "cardNumber": "1234567890123456",
      "expiryDate": "12/25"
      // Note: CVV should never be returned for security
    }
  ]
}
```

## Database Schema

### Cards Table
```sql
CREATE TABLE cards (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  card_holder_name VARCHAR(255) NOT NULL,
  card_number VARCHAR(16) NOT NULL, -- Store encrypted
  expiry_date VARCHAR(5) NOT NULL,
  cvv VARCHAR(4) NOT NULL, -- Store encrypted
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## Security Notes
1. **Encrypt card numbers and CVV** before storing in database
2. **Validate** all input data
3. **Authenticate** users before allowing card operations
4. **Never return CVV** in API responses
5. Consider using **tokenization** for production systems
6. Implement **rate limiting** to prevent abuse

## Implementation Tips
1. Use your existing authentication middleware
2. Validate card number format (Luhn algorithm)
3. Validate expiry date format (MM/YY)
4. Hash/encrypt sensitive data before storage
5. Add proper error handling
