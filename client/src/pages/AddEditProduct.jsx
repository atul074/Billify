import React, { useState, useEffect ,useContext} from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "./Layout";
import Mycontext from "../context/Mycontext";

const AddEditProduct = () => {
    const context=useContext(Mycontext);
    const{addProduct,updateProduct}=context;
  const { productId } = useParams();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductById = async () => {
      if (productId) {
        setIsEditing(true);
        try {
          const productData ={}; //await getProductById(productId);
          if (productData?.status === 200) {
            setName(productData.product.name);
            setPrice(productData.product.price);
            setStockQuantity(productData.product.stockQuantity);
            setLocation(productData.product.location);
          } else {
            showMessage(productData.message);
          }
        } catch (error) {
          showMessage(
            error.response?.data?.message ||
              "Error Getting a Product by Id: " + error
          );
        }
      }
    };

    if (productId) fetchProductById();
  }, [productId]);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("stockQuantity", stockQuantity);
    formData.append("location", location);
    console.log(formData);
    
    try {
      if (isEditing) {
        await updateProduct(formData);
        showMessage("Product successfully updated");
      } else {
        await addProduct(formData);
        showMessage("Product successfully added 🤩");
      }
      navigate("/product");
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error Saving/submit Product: " + error
      );
    }
  };

  return (
    <Layout>
      {message && (
        <div className="text-center text-white bg-red-500 p-2 mb-4 rounded">
          {message}
        </div>
      )}

      <div className="max-w-2xl mx-auto bg-white p-8 shadow-md rounded-xl">
        <h1 className="text-2xl font-bold text-teal-700 text-center mb-6">
          {isEditing ? "Edit Product" : "Add Product"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700">Product Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700">Stock Quantity</label>
            <input
              type="number"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700 transition duration-300"
          >
            {isEditing ? "Update Product" : "Add Product"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default AddEditProduct;
