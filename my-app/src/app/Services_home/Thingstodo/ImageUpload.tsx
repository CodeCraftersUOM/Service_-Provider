"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

export type CloudinaryUploadResult = {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string; // ISO 8601 date string
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  original_filename: string;
};

export type ImageObject = CloudinaryUploadResult;

type ImageUploadProps = {
  images: ImageObject[];
  onChange: (images: ImageObject[]) => void;
};

export default function ImageUpload({ images, onChange }: ImageUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);

  // Log incoming props on mount and whenever images change
  useEffect(() => {
    console.log("📦 Props received in ImageUpload:");
    console.log("Images:", images);
  }, [images]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);

    if (filesArray.length + images.length > 5) {
      alert("You can only upload up to 5 images.");
      return;
    }

    setSelectedFiles(filesArray);
  };

  const uploadToCloudinary = async (file: File): Promise<ImageObject> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default"); // Replace with your Cloudinary upload preset
    formData.append("cloud_name", "dejyhpa76"); // Replace with your Cloudinary cloud name

    console.log(`🚀 Uploading file "${file.name}" to Cloudinary...`);

    const response = await axios.post<ImageObject>(
      `https://api.cloudinary.com/v1_1/dejyhpa76/image/upload`, // Replace with your Cloudinary cloud name
      formData,
      {
        onUploadProgress: (event) => {
          if (event.total) {
            const progress = Math.round((event.loaded * 100) / event.total);
            setUploadProgress(progress);
          } else {
            setUploadProgress(0); // fallback if total is undefined
          }
        },
      }
    );

    console.log("✅ Cloudinary upload successful:", response.data);

    return response.data; // Return full Cloudinary response
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert("Please select images to upload.");
      return;
    }

    setIsUploading(true);

    const uploadedImages: ImageObject[] = [];
    for (const file of selectedFiles) {
      try {
        const imageObj = await uploadToCloudinary(file);
        uploadedImages.push(imageObj);
      } catch (err) {
        console.error(`❌ Failed to upload ${file.name}:`, err);
      }
    }

    const updatedImages = [...images, ...uploadedImages];
    console.log("📤 Updated images to send to parent:", updatedImages);
    onChange(updatedImages); // Send updated images array to parent

    setSelectedFiles([]);
    setUploadProgress(0);
    setIsUploading(false);
  };

  const handleRemoveImage = (public_id: string) => {
    const updatedImages = images.filter((img) => img.public_id !== public_id);
    console.log(`🗑️ Removed image with public_id: ${public_id}`);
    console.log("📤 Updated images after removal:", updatedImages);
    onChange(updatedImages);
  };

  return (
    <div className="image-upload">
      <h2>Upload up to 5 Images</h2>

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        disabled={isUploading || images.length >= 5}
      />

      <button
        onClick={handleUpload}
        disabled={selectedFiles.length === 0 || isUploading}
      >
        {isUploading ? `Uploading... ${uploadProgress}%` : "Upload"}
      </button>

      {uploadProgress > 0 && (
        <div style={{ marginTop: "10px" }}>
          <div
            style={{
              width: `${uploadProgress}%`,
              height: "8px",
              backgroundColor: "green",
            }}
          ></div>
          <p>{uploadProgress}%</p>
        </div>
      )}

      <div className="uploaded-images" style={{ marginTop: "20px" }}>
        <h3>Uploaded Images</h3>
        <ul>
          {images.map((image) => (
            <li key={image.asset_id} style={{ marginBottom: "10px" }}>
              <img
                src={image.secure_url}
                alt={image.original_filename}
                style={{
                  width: "100px",
                  height: "auto",
                  marginRight: "10px",
                  borderRadius: "8px",
                }}
              />
              <button onClick={() => handleRemoveImage(image.public_id)}>
                Remove
              </button>
              <p>Public ID: {image.public_id}</p>
              <p>Uploaded At: {new Date(image.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
