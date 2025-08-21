import React, { useState, useEffect } from "react";
import axios from "axios";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [userToBlock, setUserToBlock] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("https://json-sever-mru6.onrender.com/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const handleViewUser = async (user) => {
    setSelectedUser(user);
    try {
      const res = await axios.get("https://json-sever-mru6.onrender.com/orders");
      const filteredOrders = res.data.filter((order) => order.userId === user.id);
      setUserOrders(filteredOrders);
    } catch (error) {
      console.error("Error fetching user orders", error);
    }
  };

  const toggleBlockUser = async () => {
    if (!userToBlock) return;
    try {
      await axios.put(`https://json-sever-mru6.onrender.com/users/${userToBlock.id}`, { ...userToBlock, blocked: !userToBlock.blocked });
      fetchUsers();
      setShowBlockModal(false);
    } catch (error) {
      console.error("Error updating user status", error);
    }
  };

  const deleteUser = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`https://json-sever-mru6.onrender.com/users/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-5xl font-bold text-gray-900 mb-8">Manage Users</h1>
      <div className="w-full max-w-5xl bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold mb-6 text-center">Registered Users</h2>
        <ul className="divide-y divide-gray-300">
          {users.map((user) => (
            <li key={user.id} className="flex justify-between items-center py-4 px-6 bg-gray-50 hover:bg-gray-100 rounded-lg shadow-md mb-4">
              <span className="text-lg font-medium text-gray-900">{user.name || "No Name"}</span>
              <div className="space-x-4">
                <button
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700"
                  onClick={() => handleViewUser(user)}
                >
                  View
                </button>
                <button
                  className={`px-5 py-2 rounded-lg font-semibold text-white ${user.blocked ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
                  onClick={() => { setUserToBlock(user); setShowBlockModal(true); }}
                >
                  {user.blocked ? "Unblock" : "Block"}
                </button>
                <button
                  className="bg-red-700 text-white px-5 py-2 rounded-lg font-semibold hover:bg-red-800"
                  onClick={() => deleteUser(user.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-96 relative">
            <button className="absolute top-3 right-3 text-gray-600 hover:text-gray-800" onClick={() => setSelectedUser(null)}>✖</button>
            <h2 className="text-3xl font-semibold mb-4">User Details</h2>
            <p className="text-lg"><strong>Name:</strong> {selectedUser.name}</p>
            <p className="text-lg"><strong>Email:</strong> {selectedUser.email}</p>
            <p className="text-lg"><strong>Password:</strong> {selectedUser.password}</p>
            <h3 className="text-xl font-semibold mt-6 mb-3">Purchased Products</h3>
            {userOrders.length > 0 ? (
              <ul className="mt-2 text-left max-h-40 overflow-y-auto border p-2 rounded bg-gray-100">
                {userOrders.map((order, index) => (
                  <li key={index} className="border-b py-2 px-4 bg-white rounded-lg shadow-sm">{order.productName} - ${order.price}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No purchases found.</p>
            )}
            <button className="mt-6 bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-800" onClick={() => setSelectedUser(null)}>Close</button>
          </div>
        </div>
      )}

      {showBlockModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-96 text-center relative">
            <h2 className="text-2xl font-semibold mb-4">Confirm Action</h2>
            <p className="text-lg">Are you sure you want to {userToBlock.blocked ? "unblock" : "block"} this user?</p>
            <div className="mt-6 space-x-4">
              <button className="bg-red-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-red-700" onClick={toggleBlockUser}>Yes</button>
              <button className="bg-gray-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-gray-700" onClick={() => setShowBlockModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
