import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbarcontext/Navbar";
import Footer from "../footercomponent/Footer";

const OurStory = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="bg-white text-gray-900">
      <section className="relative h-[500px] bg-gradient-to-r from-gray-100 to-gray-300 flex flex-col items-center justify-center text-center px-6">
    <h1 className="text-7xl font-bold text-gray-800 drop-shadow-md">Our Story</h1>
    <h2 className="text-2xl text-gray-700 font-medium mt-4 max-w-3xl leading-relaxed">
        Taking a stylish and sustainable approach to footwear,  
        with a focus on creating a positive impact on both the world and the people.
    </h2>
</section>

        {/* See How Your Shoes Are Made */}
        <div className="text-center my-16">
          <h2 className="text-3xl font-bold">See how your shoes are made</h2>
          <p className="text-lg text-gray-600">
            Sustainable and eco-friendly materials in every step.
          </p>
        </div>

        {/* Shoe Making Process */}
        <div className="max-w-6xl mx-auto grid grid-cols-3 gap-6 items-center py-16">
          {/* Left Side - Moved Closer to Image */}
          <div className="space-y-6">
            <div className="p-6 bg-white shadow-lg rounded-lg transition-all duration-300 hover:shadow-2xl">
              <h3 className="text-xl font-bold">1. Pet canvas</h3>
              <p className="text-lg text-gray-700">
                Morbi eget bibendum sit adipiscing morbi ac nisl vitae maecenas
                nulla cursus.
              </p>
            </div>
            <div className="p-6 bg-white shadow-lg rounded-lg transition-all duration-300 hover:shadow-2xl">
              <h3 className="text-xl font-bold">2. Organic cotton</h3>
              <p className="text-lg text-gray-700">
                A vel ipsum, sed dignissim elementum ultrices amet.
              </p>
            </div>
          </div>

          {/* Center Image - Increased Size and Blends with Background */}
          <div className="flex justify-center col-span-1">
            <img
              src="https://websitedemos.net/recycled-shoe-store-04/wp-content/uploads/sites/983/2021/11/recycled-shoe-store-how-shoes-are-made-image.png"
              alt="Shoe Process"
              className="w-[900px] h-auto transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Right Side - Moved Closer to Image */}
          <div className="space-y-6">
            <div className="p-6 bg-white shadow-lg rounded-lg transition-all duration-300 hover:shadow-2xl">
              <h3 className="text-xl font-bold">3. Algae foam + vegan glue</h3>
              <p className="text-lg text-gray-700">
                Enim tincidunt donec vulputate magna pharetra mattis in.
              </p>
            </div>
            <div className="p-6 bg-white shadow-lg rounded-lg transition-all duration-300 hover:shadow-2xl">
              <h3 className="text-xl font-bold">04. Upcycled plastic bottles</h3>
              <p className="text-lg text-gray-700">
                Pellentesque viverra amet netus facilisis amet felis odio tortor
                orci cursus est.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OurStory;
