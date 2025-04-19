import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const ProductContext = createContext();

const ProductProvider = ({ children }) => {
  const [menShoes, setMenShoes] = useState([]);
  const [womenShoes, setWomenShoes] = useState([]);
  const [homeShoes, setHomeShoes] = useState([]); // ✅ Home products state
  const [dealsShoes, setDealsShoes] = useState([]);

  useEffect(() => {
    fetchMenShoes();
    fetchWomenShoes();
    fetchHomeShoes();
    fetchDealsShoes()
  }, []);
  const fetchMenShoes = async () => {
    try {
      const response = await axios.get("https://json-sever-mru6.onrender.com/men");
      console.log("Men API Response:", response.data); // 👀 Log API response
  
      const formattedMenShoes = response.data.map((shoe) => ({
        ...shoe,
        image_url: shoe.image_url || shoe.image, // 🔄 Standardize image key
      }));
  
      setMenShoes(formattedMenShoes);
    } catch (error) {
      console.error("Error fetching men's shoes:", error);
    }
  };
  

  const fetchWomenShoes = async () => {
    try {
      const response = await axios.get("https://json-sever-mru6.onrender.com/women");
      setWomenShoes(response.data);
    } catch (error) {
      console.error("Error fetching women's shoes:", error);
    }
  };

  const fetchHomeShoes = async () => {
    try {
      const response = await axios.get("https://json-sever-mru6.onrender.com/products"); // ✅ Home page products API
      setHomeShoes(response.data);
    } catch (error) {
      console.error("Error fetching home shoes:", error);
    }
  };
  const fetchDealsShoes = async () => {
    try {
      const response = await axios.get("https://json-sever-mru6.onrender.com/deals"); // ✅ Correct API
      setDealsShoes(response.data); // ✅ Correct state update
    } catch (error) {
      console.error("Error fetching deals shoes:", error); // ✅ Correct error message
    }
  };
  

  return (
    <ProductContext.Provider value={{ menShoes, womenShoes, homeShoes ,dealsShoes}}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;

