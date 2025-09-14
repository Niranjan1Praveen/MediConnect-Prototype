"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { products } from "@/assets/data/medicines";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Toaster } from "../ui/sonner";
const AppBuyMedicines = () => {
  const [cart, setCart] = useState({});
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const router = useRouter();
  const handleQuantityChange = (productName, delta) => {
    setCart((prevCart) => {
      const newQuantity = (prevCart[productName] || 0) + delta;
      if (newQuantity < 0) return prevCart;
      const product = products.find((p) => p.name === productName);
      if (newQuantity > product.stock) return prevCart;
      const updatedCart = { ...prevCart, [productName]: newQuantity };
      if (newQuantity === 0) delete updatedCart[productName];
      return updatedCart;
    });
  };

  const calculateSubtotal = () => {
    return Object.entries(cart).reduce((total, [productName, quantity]) => {
      const product = products.find((p) => p.name === productName);
      return total + product.price * quantity;
    }, 0);
  };

  const calculateTax = (subtotal) => {
    return subtotal * 0.18;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    return subtotal + tax;
  };

  const handlePlaceOrder = () => {
    setIsPlacingOrder(true);
    setTimeout(() => {
      setIsPlacingOrder(false);
      toast.success("Order placed successfully!");
      setCart({});
      router.push("http://127.0.0.1:5000/");
    }, 1000);
  };

  const handleClearCart = () => {
    setCart({});
  };

  return (
    <div className="p-6 min-h-screen flex flex-col md:flex-row gap-4">
      <Toaster />
      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Buy Medicines</h1>
          <Input
            type="text"
            placeholder="Search medicines..."
            className="border rounded-lg p-2 w-1/3"
            disabled
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card
              key={product.name}
              className="p-4 rounded-lg shadow-md flex flex-col"
            >
              <div className="flex items-center mb-2">
                <div className="p-2 rounded mr-3">
                  <span role="img" aria-label={product.category}>
                    {product.category === "Medicine" ? "💊" : "📦"}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold">{product.name}</h3>
                  <span className="text-sm text-gray-500">
                    {product.category}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-lg font-bold">
                  ₹{product.price.toLocaleString()}
                </p>
                <p className="text-sm text-green-600">Stock: {product.stock}</p>
              </div>
              <div className="flex items-center justify-center md:justify-between flex-wrap gap-4">
                <div className="flex items-center">
                  <Button
                    onClick={() => handleQuantityChange(product.name, -1)}
                    className="rounded-full w-8 h-8 flex items-center justify-center"
                  >
                    -
                  </Button>
                  <span className="mx-3">{cart[product.name] || 0}</span>
                  <Button
                    onClick={() => handleQuantityChange(product.name, 1)}
                    className="rounded-full w-8 h-8 flex items-center justify-center"
                  >
                    +
                  </Button>
                </div>
                <Button
                  onClick={() => handleQuantityChange(product.name, 1)}
                  className="border-emerald-400/30 bg-emerald-400/10 hover:bg-emerald-400/20 text-emerald-300 hover:text-emerald-200 transition-all duration-300 backdrop-blur-sm"
                >
                  Order
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Card className="md:w-1/4 w-full p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
        {Object.keys(cart).length === 0 ? (
          <div className="text-center text-gray-400">
            <p>No items added to order yet</p>
            <p className="text-sm">Add medicines from the catalog</p>
          </div>
        ) : (
          <>
            {Object.entries(cart).map(([productName, quantity]) => (
              <div key={productName} className="flex justify-between mb-2">
                <p>
                  {productName} (x{quantity})
                </p>
                <p>
                  ₹
                  {(
                    products.find((p) => p.name === productName).price *
                    quantity
                  ).toLocaleString()}
                </p>
              </div>
            ))}
            <hr className="my-4" />
            <div className="flex justify-between mb-2">
              <p>Subtotal</p>
              <p>₹{calculateSubtotal().toLocaleString()}</p>
            </div>
            <div className="flex justify-between mb-2">
              <p>Tax (18%)</p>
              <p>₹{calculateTax(calculateSubtotal()).toLocaleString()}</p>
            </div>
            <div className="flex justify-between font-semibold mb-4">
              <p>Total</p>
              <p>₹{calculateTotal().toLocaleString()}</p>
            </div>

            <Button
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
              className={`w-full bg-indigo-600 text-white py-2 rounded-lg mb-2 ${
                isPlacingOrder ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isPlacingOrder ? "Placing Order..." : "Place Order"}
            </Button>
            <Button
              onClick={handleClearCart}
              className="w-full py-2 rounded-lg flex items-center justify-center"
            >
              <span className="mr-2">🗑️</span> Clear All
            </Button>
          </>
        )}
        <div className="mt-4 text-sm">
          <p>✓ Free delivery on orders above ₹50,000</p>
          <p>✓ Cash on delivery available</p>
          <p>✓ Bulk discounts applicable</p>
        </div>
      </Card>
    </div>
  );
};

export default AppBuyMedicines;
