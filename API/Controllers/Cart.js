import { Cart } from "../Models/Cart.js";

// ✅ Add product to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, title, price, qty, img_src } = req.body;
    const userId = req.user.id; // Correct usage

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].qty += qty;
      cart.items[itemIndex].price += price * qty;
    } else {
      cart.items.push({ productId, title, price, qty, img_src });
    }

    await cart.save();
    res.status(200).json({ message: "Items added to cart", success: true, cart });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get user's cart
export const userCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({ message: "User cart retrieved", cart });
  } catch (error) {
    console.error("Fetch cart error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Remove product from cart
export const removeProductFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();
    res.status(200).json({ message: "Product removed from cart", cart });
  } catch (error) {
    console.error("Remove product error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Clear entire cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({ message: "Cart cleared", cart });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Decrease product quantity in cart
export const decreaseProductQty = async (req, res) => {
  try {
    const { productId, qty } = req.body;
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const item = cart.items[itemIndex];
    const pricePerUnit = item.price / item.qty;

    if (item.qty > qty) {
      item.qty -= qty;
      item.price -= pricePerUnit * qty;
    } else {
      // Remove item if quantity becomes 0 or less
      cart.items.splice(itemIndex, 1);
    }

    await cart.save();
    res.status(200).json({ message: "Product quantity updated", cart });
  } catch (error) {
    console.error("Decrease product qty error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
