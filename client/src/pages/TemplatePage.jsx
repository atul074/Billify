import React, { useContext, useEffect, useState } from "react";
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

  useEffect(() => {
    const fetchTemplates = async () => {
      const data = await getAllTemplates();
      setTemplates(data);
    };
    fetchTemplates();
  }, [getAllTemplates]);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file!");

    const cloudData = await uploadImageToCloudinary(file);
    if (!cloudData?.url) return alert("Image upload failed!");

    const formData = new FormData();
    formData.append("fileurl", cloudData.url);
    formData.append("uploadedBy", userdetail.email);
    formData.append("originalName", file.name);

    await uploadTemplate(formData);

    const updated = await getAllTemplates();
    setTemplates(updated);
    setFile(null);
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
      const result = await res.json();
      return result;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      return null;
    }
  };

  const handleDelete = async (id) => {
    await deleteTemplate(id);
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const handleRename = async (id) => {
    const newName = prompt("Enter new name:");
    if (newName) {
      await renameTemplate(id, newName);
      const updated = await getAllTemplates();
      setTemplates(updated);
    }
  };

  const handleSetDefault = async (id) => {
    await setDefaultTemplate(id);
    const updated = await getAllTemplates();
    setTemplates(updated);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-teal-700">Invoice Templates</h2>

        <div className="flex gap-4 items-center mb-6">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="border px-4 py-2 rounded"
          />
          <button
            onClick={handleUpload}
            className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
          >
            Upload Template
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {templates?.map((template) => (
            <div key={template.id} className="border rounded shadow p-4 relative bg-white">
              <img
                src={template.fileurl}
                alt={template.originalName}
                className="w-full h-48 object-contain mb-2"
              />
              <p className="font-medium text-center">{template.originalName}</p>
              {template.defaultTemplate && (
                <span className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 text-xs rounded">
                  Default
                </span>
              )}
              <div className="flex justify-between mt-2">
                <button
                  className="text-sm text-red-600 hover:underline"
                  onClick={() => handleDelete(template.id)}
                >
                  Delete
                </button>
                <button
                  className="text-sm text-blue-600 hover:underline"
                  onClick={() => handleRename(template.id)}
                >
                  Rename
                </button>
                <button
                  className="text-sm text-teal-600 hover:underline"
                  onClick={() => handleSetDefault(template.id)}
                >
                  Set Default
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default TemplatePage;
