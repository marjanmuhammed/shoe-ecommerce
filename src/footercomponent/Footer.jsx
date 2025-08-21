import React from 'react';
// Import Font Awesome icons
import { FaLock, FaTruck, FaUndo } from 'react-icons/fa'; // Secure Payment, Express Shipping, Free Return

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      {/* Top Section with Features */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="flex flex-col items-center md:items-start">
            <FaLock className="text-4xl mb-3 text-yellow-400" /> {/* Secure Payment Icon */}
            <h3 className="text-xl font-semibold mb-3">Secure Payment</h3>
            <p className="text-center md:text-left text-sm text-gray-400">
              All transactions are secured with encryption.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <FaTruck className="text-4xl mb-3 text-yellow-400" /> {/* Express Shipping Icon */}
            <h3 className="text-xl font-semibold mb-3">Express Shipping</h3>
            <p className="text-center md:text-left text-sm text-gray-400">
              Receive your orders quickly and safely.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <FaUndo className="text-4xl mb-3 text-yellow-400" /> {/* Free Return Icon */}
            <h3 className="text-xl font-semibold mb-3">Free Return</h3>
            <p className="text-center md:text-left text-sm text-gray-400">
              Return your order for free within 30 days.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Section with Navigation Links */}
      <div className="bg-gray-800 py-8">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12 text-gray-400">
            <div>
              <h3 className="text-lg font-semibold mb-4">Shop</h3>
              <ul>
                <li className="text-sm mb-2">Shop Men</li>
                <li className="text-sm mb-2">Shop Women</li>
                <li className="text-sm mb-2">Lookbook</li>
                <li className="text-sm mb-2">Sale</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">About</h3>
              <ul>
                <li className="text-sm mb-2">Our Story</li>
                <li className="text-sm mb-2">Our Materials</li>
                <li className="text-sm mb-2">Sustainability</li>
                <li className="text-sm mb-2">Manufacture</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
              <ul>
                <li className="text-sm mb-2">FAQs</li>
                <li className="text-sm mb-2">Shipping & Returns</li>
                <li className="text-sm mb-2">Shoe Care</li>
                <li className="text-sm mb-2">Size Chart</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul>
                <li className="text-sm mb-2">Contact</li>
              </ul>
            </div>
          </div>
{/* Payment Methods Images */}
<div className="flex justify-center space-x-8">
  
  <img src="https://websitedemos.net/recycled-shoe-store/wp-content/uploads/sites/983/2021/11/payment-icons.png" alt="Visa" className="h-6"/>
  
</div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
