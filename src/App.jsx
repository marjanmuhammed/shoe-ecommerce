import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./auth/Register";
import Login from "./auth/Login";
import Home from "./pages/Home";
import About from "./pages/About";
import Men from "./pages/Men";
import Women from "./pages/Women";
import BestDeals from './pages/Bestdeals'
import OurStory from "./pages/Ourstory";
import Contact from "./pages/Contact";
import Cart from "./cartcontext/Cart";
import Payment from "./cartcontext/Payment";
import ProductProvider from "./ProductContext/ProductContext";
import Orders from "./cartcontext/Orders";
import TrackOrder from "./cartcontext/TrackOrder";
import AdminDashboard from "./Admin/Dashbord";
import ManageProducts from "./Admin/ManageProducts";
import ManageUsers from "./Admin/ManageUsers";
import Wishlist from "./pages/Whishlist";




const App = () => {
  return (
    <ProductProvider>

    <Router>
      
    
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/men" element={<Men />} />
          <Route path="/women" element={<Women />} />
          <Route path="/bestdeals" element={<BestDeals/>}/>
          <Route path="/ourstory" element={<OurStory/>}/>
          <Route path="/contact" element={<Contact/>}/>
          <Route path="/cart" element={<Cart/>}/>
          <Route path="/pay" element={<Payment/>}/>  
          <Route path="/orders" element={<Orders/>}/>  
          <Route path="/track-order/:orderId" element={<TrackOrder />} /> 
          <Route path="/dashboard" element={<AdminDashboard/>}/>
          <Route path="/admin/products" element={<ManageProducts />} />
          <Route path="/admin/users" element={<ManageUsers />} /> 
          <Route path="/wishlist" element={<Wishlist />} />
              
        </Routes>
     
    </Router>
    </ProductProvider>
  );
};

export default App;
