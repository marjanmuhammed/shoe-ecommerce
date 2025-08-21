import axios from "axios";

const BASE_URL = "https://localhost:7175/api";    // backend URL



export const fetchHomeShoes = () => axios.get(`${BASE_URL}/Products/category/Home`);

export const fetchMenShoes = () => axios.get(`${BASE_URL}/Products/category/Men`);


export const fetchWomenShoes = () => axios.get(`${BASE_URL}/Products/category/Women`);


export const fetchDealsShoes = () => axios.get(`${BASE_URL}/Products/category/Best Deals`);
