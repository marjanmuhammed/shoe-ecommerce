import React, { useEffect, useState } from "react";
import { fetchUserProfile, updateUserProfile, changePassword } from "../Api/userApi";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const [profile, setProfile] = useState({ fullName: "", email: "" });
  const [editMode, setEditMode] = useState(null);
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordData, setPasswordData] = useState({ 
    currentPassword: "", 
    newPassword: "" 
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const response = await fetchUserProfile();
      setProfile(response.data);
    } catch (error) {
      console.error("Failed to load profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const saveName = async () => {
    try {
      setIsLoading(true);
      await updateUserProfile({ 
        fullName: nameInput, 
        email: profile.email 
      });
      setProfile(prev => ({ ...prev, fullName: nameInput }));
      toast.success("Name updated successfully");
      setEditMode(null);
    } catch (error) {
      console.error("Failed to update name:", error);
      toast.error("Failed to update name");
    } finally {
      setIsLoading(false);
    }
  };

  const saveEmail = async () => {
    try {
      setIsLoading(true);
      await updateUserProfile({ 
        fullName: profile.fullName, 
        email: emailInput 
      });
      setProfile(prev => ({ ...prev, email: emailInput }));
      toast.success("Email updated successfully");
      setEditMode(null);
    } catch (error) {
      console.error("Failed to update email:", error);
      toast.error("Failed to update email");
    } finally {
      setIsLoading(false);
    }
  };

  const savePassword = async () => {
    try {
      setIsLoading(true);
      await changePassword(passwordData);
      toast.success("Password changed successfully");
      setPasswordData({ currentPassword: "", newPassword: "" });
      setEditMode(null);
    } catch (error) {
      console.error("Failed to change password:", error);
      if (error.response?.status === 400) {
        toast.error("Current password is incorrect");
      } else {
        toast.error("Failed to change password");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !profile.fullName) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-gray-900 text-white rounded-lg shadow-lg">
        <div className="text-center">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">User Profile</h2>

      {/* Name Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-gray-300 font-semibold">Name</h3>
          <button
            onClick={() => {
              setEditMode(editMode === "name" ? null : "name");
              setNameInput(profile.fullName);
            }}
            className="text-blue-400 hover:underline text-sm"
          >
            {editMode === "name" ? "Cancel" : "Edit"}
          </button>
        </div>
        
        {editMode === "name" ? (
          <div className="space-y-2">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500"
              disabled={isLoading}
            />
            <button 
              onClick={saveName} 
              disabled={isLoading || !nameInput.trim()}
              className="bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Name"}
            </button>
          </div>
        ) : (
          <p className="text-xl">{profile.fullName}</p>
        )}
      </div>

      {/* Email Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-gray-300 font-semibold">Email</h3>
          <button
            onClick={() => {
              setEditMode(editMode === "email" ? null : "email");
              setEmailInput(profile.email);
            }}
            className="text-blue-400 hover:underline text-sm"
          >
            {editMode === "email" ? "Cancel" : "Change"}
          </button>
        </div>
        
        {editMode === "email" ? (
          <div className="space-y-2">
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500"
              disabled={isLoading}
            />
            <button 
              onClick={saveEmail} 
              disabled={isLoading || !emailInput.trim()}
              className="bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Email"}
            </button>
          </div>
        ) : (
          <p className="text-xl">{profile.email}</p>
        )}
      </div>

      {/* Password Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-gray-300 font-semibold">Password</h3>
          <button
            onClick={() => setEditMode(editMode === "password" ? null : "password")}
            className="text-blue-400 hover:underline text-sm"
          >
            {editMode === "password" ? "Cancel" : "Change"}
          </button>
        </div>
        
        {editMode === "password" && (
          <div className="space-y-2">
            <input
              type="password"
              placeholder="Current Password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData(prev => ({ 
                ...prev, 
                currentPassword: e.target.value 
              }))}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-500"
              disabled={isLoading}
            />
            <input
              type="password"
              placeholder="New Password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData(prev => ({ 
                ...prev, 
                newPassword: e.target.value 
              }))}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-500"
              disabled={isLoading}
            />
            <button 
              onClick={savePassword} 
              disabled={isLoading || !passwordData.currentPassword || !passwordData.newPassword}
              className="bg-green-600 hover:bg-green-700 py-2 px-4 rounded disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Password"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;