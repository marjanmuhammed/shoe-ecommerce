import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const AdminDashboard = () => {
  const [productCounts, setProductCounts] = useState({
    men: 0,
    women: 0,
    deals: 0,
    total: 0,
  });
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const urls = {
          men: "https://json-sever-mru6.onrender.com/men",
          women: "https://json-sever-mru6.onrender.com/women",
          deals: "https://json-sever-mru6.onrender.com/deals",
          users: "https://json-sever-mru6.onrender.com/users",
        };

        const responses = await Promise.all(
          Object.values(urls).map((url) => fetch(url))
        );

        responses.forEach((response, index) => {
          if (!response.ok) {
            throw new Error(`Error fetching ${Object.keys(urls)[index]}: ${response.statusText}`);
          }
        });

        const [menData, womenData, dealsData, usersData] = await Promise.all(
          responses.map((res) => res.json())
        );

        setProductCounts({
          men: menData.length,
          women: womenData.length,
          deals: dealsData.length,
          total: menData.length + womenData.length + dealsData.length,
        });

        setUserCount(usersData.length);
      } catch (error) {
        console.error("Fetching error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = [
    { name: "Men", value: productCounts.men },
    { name: "Women", value: productCounts.women },
    { name: "Total Products", value: productCounts.total },
    { name: "Total Users", value: userCount },
  ];

  return (
    <div className="flex h-screen w-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 p-6 flex flex-col space-y-4 fixed h-full">
        <h4 className="text-2xl font-bold text-white">Admin Panel</h4>
        <Link
          to="/admin/products"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2"
        >
          📦 <span>Manage Products</span>
        </Link>
        <Link
          to="/admin/users"
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2"
        >
          👥 <span>Manage Users</span>
        </Link>
      </div>

      {/* Main Content - Full Screen */}
      <div className="ml-64 flex-1 flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold text-center mb-4">Admin Dashboard</h1>
        <p className="text-center text-gray-300 mb-6">Track product and user trends.</p>

        {loading ? (
          <div className="flex justify-center items-center py-6">
            <div className="animate-spin h-10 w-10 border-4 border-white border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="w-full h-[85vh]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="#fff" tick={{ fontSize: 14 }} />
                <YAxis stroke="#fff" tick={{ fontSize: 14 }} />
                <Tooltip contentStyle={{ backgroundColor: "#333", color: "#fff" }} />
                <Legend wrapperStyle={{ color: "#fff", fontSize: "16px" }} iconSize={20} />

                {/* Lines for Men, Women, Total Products, and Total Users */}
                <Line type="monotone" dataKey="value" stroke="#ff7300" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
