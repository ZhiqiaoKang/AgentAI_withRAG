import React from "react";
import axios from "axios";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";

const { Dragger } = Upload;

const DOMAIN = "http://localhost:5001";

const uploadToBackend = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    // Let the browser set multipart/form-data together with its boundary.
    const response = await axios.post(`${DOMAIN}/upload`, formData);
    return response;
  } catch (error) {
    console.error("error", error);
  }
  return null;
};

const attributes = {
  name: "file",
  multiple: true,
  customRequest: async ({ file, onSuccess, onError }) => {
    const response = await uploadToBackend(file);
    if (response && response.status === 200) {
      onSuccess(response.data);
    } else {
      onError(new Error("upload failed"));
    }
  },
  onChange(info) {
    const { status } = info.file;
    if (status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (status === "done") {
      message.success("file uploaded successfully");
    }
    if (status === "error") {
      message.error("upload failed. try again later.");
    }
  },
  onDrop(e) {
    console.log("file drop e", e);
  },
};

const PdfUploader = () => {
  return (
    <Dragger {...attributes}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>

      <p className="ant-upload-text">
        Click or drag file to this are to upload your PDF for RAG search.
      </p>
    </Dragger>
  );
};

export default PdfUploader;
