import Order from "../models/orders.js";
import stripe from "../models/stripe.js";

export const createOrder = async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.user.id; // from auth middleware

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    // Calculate total
    const totalAmount = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      user: userId,
      items,
      totalAmount,
      paymentStatus: "pending",
      orderStatus: "processing",
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCheckoutSession = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: order.items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100, // Stripe uses cents
        },
        quantity: item.quantity,
      })),
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    order.stripeSessionId = session.id;
    await order.save();

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    await Order.findOneAndUpdate(
      { stripeSessionId: session.id },
      { paymentStatus: "paid" }
    );
  }

  res.json({ received: true });
};

export const getAllOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      paymentStatus,
      orderStatus,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const filter = {};

    // Search by user email or name
    if (search) {
      filter.$or = [
        { "items.name": { $regex: search, $options: "i" } },
      ];
    }

    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (orderStatus) filter.orderStatus = orderStatus;

    const total = await Order.countDocuments(filter);

    const orders = await Order.find(filter)
      .populate("user", "name email")
      .sort({ [sortBy]: order === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      orders,
      total,
      totalPages: Math.ceil(total / limit),
      page: Number(page),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};