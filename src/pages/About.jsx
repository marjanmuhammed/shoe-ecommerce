import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbarcontext/Navbar';

const About = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="relative bg-gray-100 text-gray-900 min-h-screen">
        {/* Hero Section */}
        <section
  className="relative h-[400px] bg-cover bg-center flex flex-col items-center justify-center"
  style={{ backgroundImage: "url('https://neemans.com/cdn/shop/files/About_Us.jpg?v=1679470592&width=1500')" }}
>
  {/* White overlay */}
  <div className="absolute inset-0 bg-white bg-opacity-60"></div>
  <div className="relative text-center">
    <h1 className="text-5xl font-extrabold tracking-wide drop-shadow-lg font-serif text-gray-900 hover:text-gray-700 transition duration-300">
      About Us
    </h1>
    <p className="text-lg mt-2 drop-shadow-md font-light italic text-gray-700 hover:text-gray-500 transition">
      Crafting Comfort, One Step at a Time
    </p>
    {/* Additional Shoes Store Story */}
    <div className="max-w-2xl mt-6 px-4">
      <p className="text-gray-800 text-base">
        Founded in 1990, our store has been the go-to destination for shoe enthusiasts and comfort seekers alike.
        From trendy sneakers to timeless classics, we bring you a curated selection of footwear that blends style,
        comfort, and quality. Our passion for shoes is matched only by our commitment to customer satisfaction.
        Join us on a journey where every step tells a story.
      </p>
    </div>
  </div>
</section>


        {/* About Content */}
        <div className="max-w-6xl mx-auto py-16 px-6">
          <h2 className="text-5xl font-bold text-center mb-6 font-cursive tracking-widest hover:text-blue-600 transition duration-300">Who We Are</h2>
          <p className="text-lg text-gray-700 text-center leading-relaxed font-light hover:scale-105 hover:text-blue-700 transition-transform duration-300 ease-in-out">
            At <span className="text-blue-600 font-bold italic font-mono hover:text-gray-900 transition-colors">Shoes Store</span>, we believe that footwear is more than just
            <span className="font-semibold font-cursive text-gray-900"> fashion—it's a lifestyle.</span>
            Our mission is to provide <strong className="text-gray-900 font-extrabold font-serif hover:text-blue-500">stylish, comfortable, and durable</strong> shoes for every occasion.
            Whether you're <span className="font-medium font-mono hover:text-red-500">walking the city streets</span> or
            <span className="font-semibold text-blue-500 font-cursive hover:text-green-500"> heading to a formal event</span>, we've got you covered.
          </p>

          {/* About Features with Hover Effects */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mt-12">
            {[{
              img: "https://media.istockphoto.com/id/1357653811/photo/flowers-and-grass-in-black-old-boot-on-white-background.jpg?s=612x612&w=0&k=20&c=RzVdod-qPB3RbyFvK4_o4s1X2N21-Y40bdUoo7ameEk=",
              title: "Eco-Friendly",
              desc: "We use sustainable materials to create shoes that are kind to the planet."
            }, {
              img: "https://media.istockphoto.com/id/1398610798/photo/young-woman-in-linen-shirt-shorts-and-high-heels-pointing-to-the-side-and-talking.jpg?s=612x612&w=0&k=20&c=JULY1xsUtiur9QPMxqrzgC2VbnhuT4dSnHWcpFQnuAQ=",
              title: "Superior Comfort",
              desc: "Every pair is designed with maximum comfort in mind for all-day wear."
            }, {
              img: "https://media.istockphoto.com/id/1167446806/photo/girl-is-taking-her-black-and-red-electric-scooter-denim-style-flowers-behind-her-outside.jpg?s=612x612&w=0&k=20&c=W7WxNN-rJLi_cgAYo-GXNQ2tuL6B10AYyeZFWpuqIyM=",
              title: "High Quality",
              desc: "Crafted with premium materials to ensure durability and style."
            }].map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-2xl transition-transform transform hover:scale-105 duration-300">
                <img src={item.img} alt={item.title} className="w-80 mx-auto mb-4 rounded-lg shadow-lg" />
                <h3 className="text-xl font-semibold font-serif">{item.title}</h3>
                <p className="text-gray-600 mt-2 font-light italic">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
 {/* Testimonials Section */}
 <section className="bg-blue-600 text-white py-16">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6 font-serif">What Our Customers Say</h2>
            <p className="text-lg italic">Hear from those who love our shoes!</p>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {[
                { quote: "Best shoes I've ever worn! Super comfortable and stylish!", rating: 4, name: "Sawad Amri" },
                { quote: "Amazing quality and great customer service!", rating: 5, name: "Sana" },
                { quote: "These shoes are a game-changer! Eco-friendly and stylish!", rating: 4, name: "Irfan" }
              ].map((testimonial, i) => (
                <div key={i} className="bg-white text-gray-900 p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300">
                  <p className="italic">"{testimonial.quote}"</p>
                  <h3 className="text-blue-600 font-semibold mt-3">- {testimonial.name}</h3>
                  {/* Star Rating */}
                  <div className="flex justify-center items-center mt-2 space-x-2">
                    <span className="text-lg font-bold text-gray-700">{testimonial.rating}.0</span>
                    <div className="flex">
                      {[...Array(5)].map((_, starIndex) => (
                        <svg
                          key={starIndex}
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-6 w-6 ${starIndex < testimonial.rating ? "text-yellow-400" : "text-gray-300"}`}
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.75l-6.518 3.583 1.243-7.255-5.275-5.142 7.293-1.06L12 1l3.257 6.876 7.293 1.06-5.275 5.142 1.243 7.255z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 text-center">
          <h2 className="text-4xl font-bold mb-4 font-serif">Join the Comfort Revolution</h2>
          <p className="text-lg text-gray-700 mb-6">Step into a world of <strong>style, comfort, and sustainability.</strong></p>
          <button className="px-8 py-4 bg-yellow-500 hover:bg-yellow-600 text-xl font-semibold text-white rounded-full transition duration-300" onClick={() => navigate('/')}>Shop Now</button>
        </section>
        {/* Footer */}
<footer className="bg-gray-900 text-white py-16">
  <div className="max-w-6xl mx-auto text-center">
    <h3 className="text-xl font-semibold">Follow Us</h3>
    <p className="text-gray-400">Stay updated with the latest trends and offers.</p>
    <div className="flex justify-center space-x-6 mt-4">
      <a href="#" className="text-blue-400 hover:text-white transition"><i className="fab fa-facebook text-2xl"></i></a>
      <a href="#" className="text-blue-300 hover:text-white transition"><i className="fab fa-twitter text-2xl"></i></a>
      <a href="#" className="text-pink-500 hover:text-white transition"><i className="fab fa-instagram text-2xl"></i></a>
      <a href="#" className="text-blue-500 hover:text-white transition"><i className="fab fa-linkedin text-2xl"></i></a>
      <a href="#" className="text-red-500 hover:text-white transition"><i className="fab fa-youtube text-2xl"></i></a>
    </div>
    <p className="mt-6 text-sm text-gray-400">© 2025 Shoes Store. All rights reserved.</p>
  </div>
</footer>

      </div>
    </>
  );
};

export default About;


