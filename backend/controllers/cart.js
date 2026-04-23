import Cart from '../models/cart.js';
import Product from '../models/products.js';


export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (product.stock === 0) {
      return res.status(400).json({ message: 'Out of stock' });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find(
      item => item.productId.toString() === productId
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.stock) {
        return res.status(400).json({
          message: `Only ${product.stock} items available`,
        });
      }

      existingItem.quantity = newQuantity;
    } else {
      if (quantity > product.stock) {
        return res.status(400).json({
          message: `Only ${product.stock} items available`,
        });
      }

      cart.items.push({ productId, quantity });
    }

    await cart.save();
    await cart.populate('items.productId');
    res.json(cart);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeItemFromCart = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;

  const cart = await Cart.findOne({ userId });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
  await cart.save();
  await cart.populate('items.productId');

  res.json(cart);
};

export const updateCartItemQuantity = async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const userId = req.user.id;

  const cart = await Cart.findOne({ userId });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  if (product.stock === 0) {
    return res.status(400).json({ message: "Out of stock" });
  }

  if (quantity > product.stock) {
    return res.status(400).json({
      message: `Only ${product.stock} items available`,
    });
  }

  const item = cart.items.find(
    (i) => i.productId.toString() === productId
  );

  if (!item) {
    return res.status(404).json({ message: "Item not found in cart" });
  }

  item.quantity = quantity;

  await cart.save();
  await cart.populate('items.productId');
  res.json(cart);
};

export const clearCart = async (req, res) => {
  const userId = req.user.id;

  const cart = await Cart.findOne({ userId });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  cart.items = [];
  await cart.save();
  await cart.populate('items.productId');

  res.json(cart);
};
