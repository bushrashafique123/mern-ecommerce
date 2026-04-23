import React from "react";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-yellow-50 border-t border-yellow-200 mt-16">
      <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-8">
        <div>
          <h2 className="text-2xl font-bold text-yellow-600">Groomie</h2>
          <p className="text-sm text-gray-600 mt-3">
            Your one stop shop for fashion, grooming and lifestyle products.
            Look good. Feel confident.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><Link to="/" className="hover:text-yellow-600">Home</Link></li>
            <li><Link to="/products" className="hover:text-yellow-600">Products</Link></li>
            <li><Link to="/orders" className="hover:text-yellow-600">Orders</Link></li>
            <li><Link to="/cart" className="hover:text-yellow-600">Cart</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Categories</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="hover:text-yellow-600 cursor-pointer">Clothes</li>
            <li className="hover:text-yellow-600 cursor-pointer">Perfume</li>
            <li className="hover:text-yellow-600 cursor-pointer">Accessories</li>
            <li className="hover:text-yellow-600 cursor-pointer">Shoes</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Follow Us</h3>

          <div className="flex gap-4">
            <Facebook className="cursor-pointer text-gray-600 hover:text-yellow-600"/>
            <Instagram className="cursor-pointer text-gray-600 hover:text-yellow-600"/>
            <Twitter className="cursor-pointer text-gray-600 hover:text-yellow-600"/>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            Stay connected for latest deals and trends.
          </p>
        </div>

      </div>
      <div className="border-t border-yellow-200 text-center py-4 text-sm text-gray-500">
        © {new Date().getFullYear()} Groomie. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;