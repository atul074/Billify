import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUpload, FiTrash2, FiEdit2, FiCheck, FiFile, FiImage } from "react-icons/fi";
import Layout from "./Layout";
import Mycontext from "../context/Mycontext";

const TemplatePage = () => {
  const {
    allTemplates,
    getAllTemplates,
    uploadTemplate,
    deleteTemplate,
    renameTemplate,
    setDefaultTemplate,
    userdetail,
  } = useContext(Mycontext);
  
  const [templates, setTemplates] = useState([]);
  const [file, setFile] = useState(null);
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await getAllTemplates();
        setTemplates(data);
      } catch (error) {
        showMessage("Error loading templates: " + error.message);
      }
    };
    fetchTemplates();
  }, [getAllTemplates]);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  const handleUpload = async () => {
    if (!file) {
      showMessage("Please select a file first!");
      return;
    }

    try {
      setImageLoadingState(true);
      const cloudData = await uploadImageToCloudinary(file);
      if (!cloudData?.url) {
        showMessage("Image upload failed!");
        return;
      }

      const formData = new FormData();
      formData.append("fileurl", cloudData.url);
      formData.append("uploadedBy", userdetail.email);
      formData.append("originalName", file.name);

      await uploadTemplate(formData);
      const updated = await getAllTemplates();
      setTemplates(updated);
      setFile(null);
      showMessage("Template uploaded successfully!");
    } catch (error) {
      showMessage("Error uploading template: " + error.message);
    } finally {
      setImageLoadingState(false);
    }
  };

  const uploadImageToCloudinary = async (imageFile) => {
    const data = new FormData();
    data.append("file", imageFile);
    data.append("upload_preset", "myCloud");
    data.append("cloud_name", "de7imsn1h");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/de7imsn1h/image/upload", {
        method: "POST",
        body: data,
      });
      return await res.json();
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      return null;
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this template?")) {
      try {
        await deleteTemplate(id);
        setTemplates((prev) => prev.filter((t) => t.id !== id));
        showMessage("Template deleted successfully!");
      } catch (error) {
        showMessage("Error deleting template: " + error.message);
      }
    }
  };

  const handleRename = async (id) => {
    const template = templates.find(t => t.id === id);
    const newName = prompt("Enter new name:", template.originalName);
    if (newName && newName !== template.originalName) {
      try {
        await renameTemplate(id, newName);
        const updated = await getAllTemplates();
        setTemplates(updated);
        showMessage("Template renamed successfully!");
      } catch (error) {
        showMessage("Error renaming template: " + error.message);
      }
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await setDefaultTemplate(id);
      const updated = await getAllTemplates();
      setTemplates(updated);
      showMessage("Default template set successfully!");
    } catch (error) {
      showMessage("Error setting default template: " + error.message);
    }
  };

  return (
    <Layout>
      <AnimatePresence>
        {message && (
          <motion.div
            className="mx-auto max-w-4xl mb-6 p-4 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{
              background: message.includes("success") 
                ? "linear-gradient(135deg, #4ade80, #22d3ee)"
                : "linear-gradient(135deg, #f87171, #f59e0b)"
            }}
          >
            <p className="text-white font-medium text-center">{message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-1">Invoice Templates</h2>
              <p className="text-gray-500">Manage your professional invoice designs</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <label className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition border border-gray-200">
                <FiUpload className="text-gray-600" />
                <span className="text-gray-700 font-medium">
                  {file ? file.name.substring(0, 20) + (file.name.length > 20 ? "..." : "") : "Choose File"}
                </span>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                  accept="image/*"
                />
              </label>
              <button
                onClick={handleUpload}
                disabled={!file || imageLoadingState}
                className={`flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-white font-medium ${
                  !file || imageLoadingState ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                } transition`}
              >
                {imageLoadingState ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <FiUpload /> Upload
                  </>
                )}
              </button>
            </div>
          </div>

          {templates?.length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 text-center">
              <FiFile className="mx-auto text-5xl text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                No templates found
              </h3>
              <p className="text-gray-500">
                Upload your first template to get started
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates?.map((template) => (
                <div 
                  key={template.id}
                  className={`border rounded-lg shadow-sm overflow-hidden transition hover:shadow-md ${
                    template.defaultTemplate 
                      ? 'border-2 border-green-500 bg-green-50' 
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="h-48 bg-gray-50 flex items-center justify-center p-2">
                    {template.filename ? (
                      <img
                        src={template.filename}
                        alt={template.originalName}
                        className="max-h-full max-w-full object-contain"
                        style={{ imageRendering: 'auto' }}
                      />
                    ) : (
                      <FiImage className="text-5xl text-gray-300" />
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-medium text-gray-800 truncate">
                        {template.originalName}
                      </h3>
                      {template.defaultTemplate && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <FiCheck className="mr-1" /> Default
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleDelete(template.id)}
                        className="flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded text-sm hover:bg-red-100 flex-1 min-w-[100px]"
                      >
                        <FiTrash2 size={14} /> Delete
                      </button>
                      <button
                        onClick={() => handleRename(template.id)}
                        className="flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded text-sm hover:bg-blue-100 flex-1 min-w-[100px]"
                      >
                        <FiEdit2 size={14} /> Rename
                      </button>
                      {!template.defaultTemplate && (
                        <button
                          onClick={() => handleSetDefault(template.id)}
                          className="flex items-center justify-center gap-1 px-3 py-2 bg-green-50 text-green-600 rounded text-sm hover:bg-green-100 flex-1 min-w-[100px]"
                        >
                          <FiCheck size={14} /> Set Default
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TemplatePage;