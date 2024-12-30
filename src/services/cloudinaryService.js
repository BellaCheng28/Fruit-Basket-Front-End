import axios from "axios";

const uploadFileToCloudinary = async (file, productName) => {
  // console.log("productName:", productName);
  const formData = new FormData();
  formData.append("file", file); // 上传的文件
  formData.append(
    "upload_preset",
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  ); // 上传预设
  formData.append("public_id", `fruits/${productName}_${new Date().getTime()}`); // 自console.log("file type:", file.type);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
      }/image/upload`,
      formData
    );
    // 获取上传后的图片 URL
    return response.data.secure_url; // 返回图片的 URL
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data); // 打印 Cloudinary 返回的错误信息
    } else {
      console.error("Error uploading file:", error.message);
    }
    throw new Error("File upload failed");
  }
};

export default uploadFileToCloudinary ;
