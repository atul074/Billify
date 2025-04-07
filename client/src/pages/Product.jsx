import React, { useState, useEffect ,useContext} from "react";

import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import Mycontext from "../context/Mycontext";


function Product(){

    const [products, setProducts] = useState([]);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const context=useContext(Mycontext);
    const{addProduct,getAllProducts}=context;

    useEffect(() => {
        const getProducts = async () => {
          try {
            const productData = await getAllProducts();
            if (productData?.status === 200) {
              setProducts(productData.products);
            }
          } catch (error) {
            showMessage(
              error.response?.data?.message || "Error Getting Products: " + error
            );
          }
        };
        getProducts();
      }, []);
    
      const handleDeleteProduct = async (productId) => {
        if (window.confirm("Are you sure you want to delete this Product?")) {
          try {
           // await ApiService.deleteProduct(productId);
            showMessage("Product successfully deleted");
            setProducts(products.filter((p) => p.id !== productId));
          } catch (error) {
            showMessage(
              error.response?.data?.message ||
                "Error deleting product: " + error
            );
          }
        }
      };
    
      const showMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => {
          setMessage("");
        }, 4000);
      };
    

    return(
        <Layout>
      {message && (
        <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded">
          {message}
        </div>
      )}

      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-teal-700">Products</h1>
          <button
            className="px-5 py-3 bg-teal-600 hover:bg-teal-800 text-white rounded-lg"
            onClick={() => navigate("/add-product")}
          >
            Add Product
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white shadow-lg rounded-xl p-4 hover:shadow-xl transition"
            >
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {product.name}
                </h3>
              </div>
              <div className="text-sm text-gray-600 space-y-1 mb-4">
                <p>Price: ₹{product.price}</p>
                <p>Quantity: {product.stockQuantity}</p>
                <p>Location: {product.location}</p>
              </div>
              <div className="flex justify-center gap-3">
                <button
                  className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-800"
                  onClick={() => navigate(`/edit-product/${product.id}`)}
                >
                  Edit
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-800"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
    }
    
    export default Product;