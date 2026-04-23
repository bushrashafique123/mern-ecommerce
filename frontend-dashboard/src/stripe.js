// Stripe configuration for React frontend
// This file exports the Stripe promise for use with Elements provider
import { loadStripe } from '@stripe/stripe-js';

// TODO: Replace with your actual Stripe publishable key
const stripePromise = loadStripe('pk_test_XXXXXXXXXXXXXXXXXXXXXXXX');

export default stripePromise;
