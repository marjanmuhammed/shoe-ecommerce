import React, { createContext, useState, useEffect } from "react";
import { fetchMenShoes, fetchWomenShoes, fetchHomeShoes, fetchDealsShoes } from "../Api/productApi";

export const ProductContext = createContext();

const ProductProvider = ({ children }) => {
  const [menShoes, setMenShoes] = useState([]);
  const [womenShoes, setWomenShoes] = useState([]);
  const [homeShoes, setHomeShoes] = useState([]);
  const [dealsShoes, setDealsShoes] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const menResponse = await fetchMenShoes();
      setMenShoes(menResponse.data);

      const womenResponse = await fetchWomenShoes();
      setWomenShoes(womenResponse.data);

      const homeResponse = await fetchHomeShoes();
      setHomeShoes(homeResponse.data);

      const dealsResponse = await fetchDealsShoes();
      setDealsShoes(dealsResponse.data);
    } catch (error) {
      console.error("Error loading products from backend:", error);
    }
  };

  return (
    <ProductContext.Provider value={{ menShoes, womenShoes, homeShoes, dealsShoes }}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;
