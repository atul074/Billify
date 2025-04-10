import React, { useContext } from "react";
import Mycontext from "../context/Mycontext";
import Layout from "./Layout";

const Profile = () => {
  const context = useContext(Mycontext);
  const { userdetail } = context;

 

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-screen p-5 bg-gray-100">
        

        {userdetail && (
          <div className="bg-gradient-to-br from-gray-100 to-white rounded-2xl shadow-[10px_10px_20px_rgba(0,0,0,0.1),-10px_-10px_20px_rgba(255,255,255,0.5)] p-10 w-full max-w-2xl text-center transition-transform duration-300 hover:scale-105 hover:shadow-[10px_20px_40px_rgba(0,0,0,0.15)] animate-fade-in">
            <h1 className="text-4xl font-bold text-teal-600 mb-20 capitalize">
              Hello, {userdetail.username} 🥳
            </h1>
            <div className="p-5 bg-gray-50 rounded-lg shadow-inner">
              <div className="flex justify-between py-2 border-b border-gray-200 text-lg text-gray-700">
                <label className="font-semibold text-teal-600">Name</label>
                <span className="text-gray-800">{userdetail.username}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200 text-lg text-gray-700">
                <label className="font-semibold text-teal-600">Email</label>
                <span className="text-gray-800">{userdetail.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200 text-lg text-gray-700">
                <label className="font-semibold text-teal-600">Phone Number</label>
                <span className="text-gray-800">{userdetail.phoneNo}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200 text-lg text-gray-700">
                <label className="font-semibold text-teal-600">Address</label>
                <span className="text-gray-800">{userdetail.address}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Profile;
