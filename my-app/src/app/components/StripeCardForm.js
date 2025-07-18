"use client";
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51RlV0ULm4wWgyhyBvv0KqRNtKgvbBZVv1Z0uwHhygxjbiXmRuEWic2jFgR8TgcyoeGmWVsZWwWlSxYPEXPflA9o300udbmpj4W");

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      setMessage(error.message);
      setProcessing(false);
    } else {
      // send paymentMethod.id to your backend
      const res = await fetch("http://localhost:2000/api/createCardDetail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMethodId: paymentMethod.id }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage("Card saved successfully! 🎉");
      } else {
        setMessage("Error saving card");
      }
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={processing}>
        {processing ? "Processing..." : "Save Card"}
      </button>
      <p>{message}</p>
    </form>
  );
};

export default function StripeCardForm() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
