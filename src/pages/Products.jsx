import React, { useContext } from 'react';
import { ProductContext } from '../ProductContext/ProductContext';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { motion } from "framer-motion";
import 'react-lazy-load-image-component/src/effects/blur.css';

const Products = () => {
  const { homeShoes } = useContext(ProductContext);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 md:gap-14 px-6 pb-12">
      {homeShoes.map((shoe, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.6,
            delay: index * 0.2,
            ease: "easeInOut",
          }}
          className="relative p-12 md:p-16 rounded-lg bg-white shadow-2xl hover:shadow-[0_0_40px_#3b82f6] transition duration-300 transform hover:scale-110"
        >
          <LazyLoadImage
            src={shoe.image_url || "https://via.placeholder.com/200"}
            alt={shoe.name}
            effect="blur"
            className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-contain mx-auto rounded-lg"
            onError={(e) => e.target.src = "https://placehold.co/200"}
          />
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mt-4 sm:mt-6 text-gray-900 text-center">
            {shoe.name}
          </h3>
          <p className="text-gray-700 text-sm sm:text-lg md:text-xl mt-2 sm:mt-4 text-center">
            {shoe.description}
          </p>
          <p className="text-lg sm:text-2xl md:text-3xl font-extrabold text-blue-700 mt-2 sm:mt-4 text-center">
            ${shoe.price}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default Products;
