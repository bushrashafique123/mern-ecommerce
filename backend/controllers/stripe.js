export const createPaymentIntent = async (req, res) => {
  const { amount, currency } = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
  });
  res.send({ clientSecret: paymentIntent.client_secret });
};