// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const ManageProducts = () => {
//   const [products, setProducts] = useState([]);
//   const [editingProduct, setEditingProduct] = useState(null);
//   const [selectedCategory, setSelectedCategory] = useState("men");
//   const [productData, setProductData] = useState({
//     name: "",
//     price: "",
//     description: "",
//     image: "",
//     category: "men",
//   });

//   useEffect(() => {
//     fetchProducts();
//   }, [selectedCategory]);

//   const fetchProducts = async () => {
//     try {
//       const url = `http://localhost:3000/${selectedCategory}`;
//       console.log("Fetching from:", url); 
//       const res = await axios.get(url);
//       console.log("Fetched Products:", res.data); 

//       // Ensure correct image field
//       const updatedProducts = res.data.map((product) => ({
//         ...product,
//         image: product.image || product.image_url || "https://placehold.co/200",
//       }));

//       setProducts(updatedProducts);
//     } catch (error) {
//       console.error("Error fetching products", error);
//     }
//   };

//   const handleEdit = (product) => {
//     setEditingProduct(product);
//     setProductData({
//       name: product.name,
//       price: product.price,
//       description: product.description,
//       image: product.image || product.image_url || "",
//       category: selectedCategory,
//     });
//   };

//   const handleSaveProduct = async () => {
//     if (!productData.name) {
//       alert("⚠️ Product name is required!");
//       return;
//     }

//     try {
//       if (editingProduct) {
//         const updatedProduct = { ...productData, category: selectedCategory };
//         await axios.put(
//           `http://localhost:3000/${selectedCategory}/${editingProduct.id}`,
//           updatedProduct
//         );
//       } else {
//         if (!productData.price || !productData.image) {
//           alert("⚠️ Please fill all fields to add a new product!");
//           return;
//         }
//         const res = await axios.post(`http://localhost:3000/${selectedCategory}`, productData);
//         console.log(res.data);
        
//         setProducts((prevProducts) => [...prevProducts, res.data]);

//       }
//       setProductData({ name: "", price: "", description: "", image: "", category: selectedCategory });
//       setEditingProduct(null);
//       fetchProducts();
//     } catch (error) {
//       console.error("Error saving product", error);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       const url = `http://localhost:3000/${selectedCategory}/${id}`;
//       console.log("Deleting from:", url); // Debugging
//       await axios.delete(url);
//       fetchProducts();
//     } catch (error) {
//       console.error("Error deleting product", error);
//     }
//   };
//   return (
//     <>
//       {/* Category Selector */}
//       <div className="text-center py-6 bg-gray-100">
//         <h1 className="text-4xl font-extrabold mb-4">🏬 Manage Your Products</h1>
//         <select
//           className="p-3 border border-gray-400 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//           value={selectedCategory}
//           onChange={(e) => setSelectedCategory(e.target.value)}
//         >
//           <option value="men">👕 Men's Collection</option>
//           <option value="women">👗 Women's Collection</option>
//           <option value="deals">🔥 Best Deals</option>
//         </select>
//       </div>

//       {/* Product Form */}
//       <section className="py-16 px-6">
//         <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
//           <h2 className="text-2xl font-bold text-center mb-6">
//             {editingProduct ? "✏️ Update Product" : "➕ Add New Product"}
//           </h2>
//           <div className="space-y-4">
//             <input
//               type="text"
//               placeholder="Product Name"
//               className="w-full p-3 border border-gray-300 bg-gray-50 rounded-md focus:ring-2 focus:ring-blue-400"
//               value={productData.name}
//               onChange={(e) => setProductData({ ...productData, name: e.target.value })}
//             />
//             <input
//               type="number"
//               placeholder="Price"
//               className="w-full p-3 border border-gray-300 bg-gray-50 rounded-md focus:ring-2 focus:ring-blue-400"
//               value={productData.price}
//               onChange={(e) => setProductData({ ...productData, price: e.target.value })}
//             />
//             <input
//               type="text"
//               placeholder="Description"
//               className="w-full p-3 border border-gray-300 bg-gray-50 rounded-md focus:ring-2 focus:ring-blue-400"
//               value={productData.description}
//               onChange={(e) => setProductData({ ...productData, description: e.target.value })}
//             />
//             <input
//               type="text"
//               placeholder="Image URL"
//               className="w-full p-3 border border-gray-300 bg-gray-50 rounded-md focus:ring-2 focus:ring-blue-400"
//               value={productData.image}
//               onChange={(e) => setProductData({ ...productData, image: e.target.value })}
//             />
//             {productData.image && (
//               <img
//                 src={productData.image}
//                 alt="Preview"
//                 className="w-48 h-48 object-contain mx-auto border rounded-md shadow-sm"
//                 onError={(e) => (e.target.src = "https://placehold.co/150")}
//               />
//             )}
//             <button
//               className="w-full bg-blue-500 text-white p-3 rounded-md font-bold hover:bg-blue-600 transition"
//               onClick={handleSaveProduct}
//             >
//               {editingProduct ? "Update Product" : "Add Product"}
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* Products Grid */}
//       <section className="py-16 px-6 bg-gray-100">
//         <h2 className="text-3xl font-bold text-center mb-8">
//           {selectedCategory.replace("-", " ").toUpperCase()} Collection
//         </h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
//           {products.map((product) => (
//             <div
//               key={product.id}
//               className="p-12 rounded-lg bg-white shadow-2xl hover:shadow-[0_0_40px_#3b82f6] transition duration-300 transform hover:scale-110"
//             >
//               <img
//                 src={product.image || "https://placehold.co/200"}
//                 alt={product.name}
//                 className="w-40 h-40 object-contain mx-auto rounded-lg"
//                 onError={(e) => (e.target.src = "https://placehold.co/200")}
//               />
//               <h3 className="text-xl font-bold mt-4 text-gray-900 text-center">
//                 {product.name}
//               </h3>
//               <p className="text-gray-700 text-center">{product.description}</p>
//               <p className="text-2xl font-extrabold text-blue-700 mt-2 text-center">
//                 ${product.price}
//               </p>
//               <div className="flex justify-between mt-6">
//                 <button
//                   className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition"
//                   onClick={() => handleEdit(product)}
//                 >
//                   ✏️ Edit
//                 </button>
//                 <button
//                   className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
//                   onClick={() => handleDelete(product.id)}
//                 >
//                   🗑️ Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>
//     </>
//   );
// };

// export default ManageProducts;



////////////////////////////////////



import React, { useState, useEffect } from "react";
import axios from "axios";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("men");
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    category: "men",
  });

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      const url = `https://json-sever-mru6.onrender.com/${selectedCategory}`;
      console.log("Fetching from:", url);
      const res = await axios.get(url);
      console.log("Fetched Products:", res.data);

      const updatedProducts = res.data.map((product) => ({
        ...product,
        image: product.image || product.image_url || "https://placehold.co/200",
      }));

      setProducts(updatedProducts);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setProductData({
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image || product.image_url || "https://placehold.co/200",
      category: selectedCategory,
    });
  };

  const handleSaveProduct = async () => {
    if (!productData.name) {
      alert("⚠️ Product name is required!");
      return;
    }

    try {
      if (editingProduct) {
        const updatedProduct = { ...productData, category: selectedCategory };
        await axios.put(
          `https://json-sever-mru6.onrender.com/${selectedCategory}/${editingProduct.id}`,
          updatedProduct
        );
      } else {
        if (!productData.price || !productData.image) {
          alert("⚠️ Please fill all fields to add a new product!");
          return;
        }
        const res = await axios.post(
          `https://json-sever-mru6.onrender.com/${selectedCategory}`,
          productData
        );
        console.log(res.data);
        setProducts((prevProducts) => [...prevProducts, res.data]);
      }
      setProductData({
        name: "",
        price: "",
        description: "",
        image: "",
        category: selectedCategory,
      });
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Error saving product", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const url = `https://json-sever-mru6.onrender.com/${selectedCategory}/${id}`;
      console.log("Deleting from:", url);
      await axios.delete(url);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product", error);
    }
  };

  return (
    <>
      {/* Category Selector */}
      <div className="text-center py-6 bg-gray-100">
        <h1 className="text-4xl font-extrabold mb-4">🏬 Manage Your Products</h1>
        <select
          className="p-3 border border-gray-400 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="men">👕 Men's Collection</option>
          <option value="women">👗 Women's Collection</option>
          <option value="deals">🔥 Best Deals</option>
        </select>
      </div>

      {/* Product Form */}
      <section className="py-16 px-6">
        <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6">
            {editingProduct ? "✏️ Update Product" : "➕ Add New Product"}
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Product Name"
              className="w-full p-3 border border-gray-300 bg-gray-50 rounded-md focus:ring-2 focus:ring-blue-400"
              value={productData.name}
              onChange={(e) =>
                setProductData({ ...productData, name: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Price"
              className="w-full p-3 border border-gray-300 bg-gray-50 rounded-md focus:ring-2 focus:ring-blue-400"
              value={productData.price}
              onChange={(e) =>
                setProductData({ ...productData, price: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Description"
              className="w-full p-3 border border-gray-300 bg-gray-50 rounded-md focus:ring-2 focus:ring-blue-400"
              value={productData.description}
              onChange={(e) =>
                setProductData({ ...productData, description: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Image URL"
              className="w-full p-3 border border-gray-300 bg-gray-50 rounded-md focus:ring-2 focus:ring-blue-400"
              value={productData.image}
              onChange={(e) =>
                setProductData({ ...productData, image: e.target.value })
              }
            />
            {productData.image && (
              <img
                src={productData.image}
                alt="Preview"
                className="w-48 h-48 object-contain mx-auto border rounded-md shadow-sm"
                onError={(e) => {
                  if (e.target.src !== "https://placehold.co/150") {
                    e.target.src = "https://placehold.co/150";
                  }
                }}
              />
            )}
            <button
              className="w-full bg-blue-500 text-white p-3 rounded-md font-bold hover:bg-blue-600 transition"
              onClick={handleSaveProduct}
            >
              {editingProduct ? "Update Product" : "Add Product"}
            </button>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 px-6 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-8">
          {selectedCategory.replace("-", " ").toUpperCase()} Collection
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
          {products.map((product) => (
            <div
              key={product.id}
              className="p-12 rounded-lg bg-white shadow-2xl hover:shadow-[0_0_40px_#3b82f6] transition duration-300 transform hover:scale-110"
            >
              <img
                src={product.image || "https://placehold.co/200"}
                alt={product.name}
                className="w-40 h-40 object-contain mx-auto rounded-lg"
                onError={(e) => {
                  if (e.target.src !== "https://placehold.co/200") {
                    e.target.src = "https://placehold.co/200";
                  }
                }}
              />
              <h3 className="text-xl font-bold mt-4 text-gray-900 text-center">
                {product.name}
              </h3>
              <p className="text-gray-700 text-center">{product.description}</p>
              <p className="text-2xl font-extrabold text-blue-700 mt-2 text-center">
                ${product.price}
              </p>
              <div className="flex justify-between mt-6">
                <button
                  className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition"
                  onClick={() => handleEdit(product)}
                >
                  ✏️ Edit
                </button>
                <button
                  className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
                  onClick={() => handleDelete(product.id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default ManageProducts;
