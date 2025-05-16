import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const upfile = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/convert/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Gặp lỗi khi upload: ${error}`);
  }
};

const downfile = async (docId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/download/${docId}`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "converted.docx");
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Lỗi khi tải file:", error);
    throw new Error(`Gặp lỗi khi download: ${error}`);
  }
};

export { upfile, downfile };
