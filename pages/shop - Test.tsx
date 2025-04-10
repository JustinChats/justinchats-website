import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FaShoppingCart, FaInstagram, FaTwitch, FaYoutube, FaTwitter, FaHome } from 'react-icons/fa';

interface ShopItem {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface CartItem extends ShopItem {
  quantity: number;
}

const Shop: React.FC = () => {
  // Generate 30 example items
  const shopItems: ShopItem[] = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    name: `Example Item ${i + 1}`,
    price: 20,
    image: `/placeholder/product-${(i % 5) + 1}.jpg`,
  }));

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('justinchats-cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('justinchats-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: ShopItem) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      if (existingItem) {
        return prevItems.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId: number) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return prevItems.map(i => 
          i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
        );
      } else {
        return prevItems.filter(i => i.id !== itemId);
      }
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Head>
        <title>Shop | JustinChats</title>
        <meta name="description" content="Shop JustinChats merchandise and digital products" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navigation */}
      <nav className="bg-indigo-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold flex items-center">
            <FaHome className="mr-2" /> JustinChats
          </Link>
          <div className="flex space-x-6">
            <Link href="/" className="hover:text-indigo-200 transition">Home</Link>
            <Link href="/stream" className="hover:text-indigo-200 transition">Stream</Link>
            <Link href="/coaching" className="hover:text-indigo-200 transition">Coaching</Link>
            <Link href="/contact" className="hover:text-indigo-200 transition">Contact</Link>
            <Link href="/shop" className="font-bold border-b-2 border-white">Shop</Link>
          </div>
          <div className="relative">
            <button 
              onClick={() => setIsCartOpen(!isCartOpen)} 
              className="relative p-2 rounded-full hover:bg-indigo-700 transition"
            >
              <FaShoppingCart size={24} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
            
            {/* Shopping Cart Dropdown */}
            {isCartOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg overflow-hidden z-20 text-gray-800">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold">Your Cart</h3>
                    {cartItems.length > 0 && (
                      <button 
                        onClick={clearCart}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  
                  {cartItems.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Your cart is empty</p>
                  ) : (
                    <>
                      <div className="max-h-60 overflow-y-auto">
                        {cartItems.map(item => (
                          <div key={item.id} className="flex justify-between items-center py-2 border-b">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-gray-500 text-sm">${item.price} × {item.quantity}</p>
                            </div>
                            <div className="flex items-center">
                              <button 
                                onClick={() => removeFromCart(item.id)}
                                className="text-gray-500 hover:text-red-500 px-2"
                              >
                                −
                              </button>
                              <span className="w-6 text-center">{item.quantity}</span>
                              <button 
                                onClick={() => addToCart(item)}
                                className="text-gray-500 hover:text-green-500 px-2"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 pt-2 border-t">
                        <div className="flex justify-between font-bold">
                          <span>Total:</span>
                          <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <button className="w-full mt-4 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">
                          Checkout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto py-10 px-4">
        <h1 className="text-4xl font-bold text-center mb-10">JustinChats Shop</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {shopItems.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                {/* Placeholder image */}
                <span className="text-gray-400">Product Image</span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg">{item.name}</h3>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-lg font-semibold">${item.price}</span>
                  <button 
                    onClick={() => addToCart(item)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold">JustinChats</h2>
              <p className="mt-2 text-gray-400">Content Creator & Gaming Coach</p>
            </div>
            <div className="flex space-x-6">
              <a href="https://instagram.com/justinchats" className="hover:text-indigo-400 transition">
                <FaInstagram size={24} />
              </a>
              <a href="https://twitch.tv/justinchats" className="hover:text-indigo-400 transition">
                <FaTwitch size={24} />
              </a>
              <a href="https://youtube.com/justinchats" className="hover:text-indigo-400 transition">
                <FaYoutube size={24} />
              </a>
              <a href="https://twitter.com/justinchats" className="hover:text-indigo-400 transition">
                <FaTwitter size={24} />
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} JustinChats. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Overlay when cart is open */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setIsCartOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Shop;